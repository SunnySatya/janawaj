/**
 * Migration Script: Migrate local /uploads/ files to Cloudinary
 * -------------------------------------------------------------
 * Problem:
 *   - Images uploaded via the admin panel (before Cloudinary was integrated)
 *     were saved to the local `server/uploads/` folder.
 *   - The database stores their paths as `/uploads/<filename>`.
 *   - On Render, this folder does not exist (it's gitignored), so images 404.
 *
 * Solution:
 *   - Run this script ONCE on your local machine (where `server/uploads/`
 *     still contains the files).
 *   - It uploads each local file to Cloudinary, then updates every News and
 *     Slider document that references `/uploads/<filename>` with the new
 *     Cloudinary secure URL.
 *
 * Usage:
 *   cd server
 *   node migrate-uploads-to-cloudinary.js
 *
 * Requirements:
 *   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in
 *     server/.env (or process env)
 *   - MONGODB_URI in server/.env
 *   - The local files must exist in server/uploads/
 */

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/janawaj";

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

const UPLOADS_DIR = path.join(__dirname, "uploads");

async function run() {
  if (!cloudinaryConfigured) {
    console.error(
      "❌ Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in server/.env",
    );
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  const cloudinary = require("./config/cloudinary");
  const News = require("./models/News");
  const Slider = require("./models/Slider");

  // Find all documents referencing local /uploads/ files
  const newsDocs = await News.find({
    image: { $regex: "^/uploads/" },
  });
  const sliderDocs = await Slider.find({
    image: { $regex: "^/uploads/" },
  });

  console.log(`📰 News with local upload paths: ${newsDocs.length}`);
  console.log(`🎠 Sliders with local upload paths: ${sliderDocs.length}`);

  if (newsDocs.length === 0 && sliderDocs.length === 0) {
    console.log(
      "\n✨ Nothing to migrate — all images already use Cloudinary/remote URLs.",
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  // Build a map of filename -> Cloudinary result so each file is uploaded once
  const uploadCache = new Map();

  const getCloudinaryUrl = async (imagePath) => {
    // imagePath looks like: /uploads/file-123.jpeg
    const filename = imagePath.replace(/^\/uploads\//, "");
    if (!filename) return null;

    if (uploadCache.has(filename)) {
      return uploadCache.get(filename);
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Local file not found: ${filePath}`);
      uploadCache.set(filename, null);
      return null;
    }

    try {
      console.log(`⬆️  Uploading ${filename} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "janawaj",
        use_filename: true,
        unique_filename: true,
        transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
      });
      uploadCache.set(filename, result.secure_url);
      console.log(`   ✅ -> ${result.secure_url}`);
      return result.secure_url;
    } catch (err) {
      console.error(`   ❌ Failed to upload ${filename}:`, err.message);
      uploadCache.set(filename, null);
      return null;
    }
  };

  let updatedNews = 0;
  let updatedSliders = 0;
  const failedFiles = [];

  // Migrate News
  for (const doc of newsDocs) {
    const newUrl = await getCloudinaryUrl(doc.image);
    if (!newUrl) {
      failedFiles.push(`news/${doc._id} (${doc.image})`);
      continue;
    }
    doc.image = newUrl;
    doc.imagePublicId = `janawaj/${path.basename(newUrl).split(".")[0]}`;
    await doc.save();
    updatedNews++;
  }

  // Migrate Sliders
  for (const doc of sliderDocs) {
    const newUrl = await getCloudinaryUrl(doc.image);
    if (!newUrl) {
      failedFiles.push(`slider/${doc._id} (${doc.image})`);
      continue;
    }
    doc.image = newUrl;
    doc.imagePublicId = `janawaj/${path.basename(newUrl).split(".")[0]}`;
    await doc.save();
    updatedSliders++;
  }

  console.log("\n──────────────────────────────────");
  console.log("📊 Migration Summary");
  console.log(`   News updated:   ${updatedNews}`);
  console.log(`   Sliders updated: ${updatedSliders}`);
  if (failedFiles.length > 0) {
    console.log(`   Failed (${failedFiles.length}):`);
    failedFiles.forEach((f) => console.log(`     - ${f}`));
  }
  console.log("──────────────────────────────────");

  await mongoose.disconnect();
  console.log("\n🎉 Migration complete!");
  process.exit(0);
}

run().catch(async (err) => {
  console.error("❌ Migration failed:", err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
