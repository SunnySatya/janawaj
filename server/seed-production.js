require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/janawaj";

const seedProduction = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected\n");

    const User = require("./models/User");
    const News = require("./models/News");
    const Slider = require("./models/Slider");
    const Poll = require("./models/Poll");

    // 1. Create Admin
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      admin = await User.create({
        fullName: "Admin",
        email: "admin@janawaj.com",
        password: "Admin@123",
        role: "admin",
        isActive: true,
      });
      console.log("✅ Admin created: admin@janawaj.com / Admin@123");
    } else {
      console.log(`✅ Admin exists: ${admin.email}`);
      // Reset password
      admin.password = "Admin@123";
      await admin.save();
      console.log("✅ Admin password reset to: Admin@123");
    }

    // Check if news exists
    const newsCount = await News.countDocuments();
    if (newsCount > 0) {
      console.log(
        `⚠️ Data already exists (${newsCount} news, etc). Skipping seed.`,
      );
      console.log("\n🎉 Production DB already has data!");
      await mongoose.disconnect();
      process.exit(0);
    }

    // 2. Create News
    console.log("\n📰 Creating news...");
    const newsData = [
      {
        title: "भारत ने अंतरिक्ष में रचा इतिहास",
        description:
          "भारत ने अंतरिक्ष अनुसंधान के क्षेत्र में एक और बड़ी उपलब्धि हासिल की है।",
        content:
          "भारत ने अंतरिक्ष अनुसंधान के क्षेत्र में एक और बड़ी उपलब्धि हासिल की है। यह मिशन पूरी तरह से सफल रहा।",
        image:
          "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
        category: "National",
        tags: ["space", "isro"],
        isFeatured: true,
      },
      {
        title: "Digital India: गांवों में इंटरनेट क्रांति",
        description:
          "सरकार की डिजिटल इंडिया योजना के तहत देश के हर गांव को इंटरनेट से जोड़ने का अभियान तेज।",
        content:
          "डिजिटल इंडिया योजना के तहत सरकार देश के हर गांव को इंटरनेट से जोड़ रही है।",
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        category: "Technology",
        tags: ["digital india"],
        isFeatured: true,
      },
      {
        title: "IPL 2025 का रोमांच",
        description:
          "आईपीएल 2025 के लिए सभी टीमों ने अपनी तैयारी शुरू कर दी है।",
        content:
          "आईपीएल 2025 के लिए तैयारियां जोरों पर हैं। नीलामी में बड़े खिलाड़ियों पर करोड़ों की बोली।",
        image:
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
        category: "Sports",
        tags: ["ipl"],
        isFeatured: true,
      },
      {
        title: "देश की अर्थव्यवस्था मजबूत",
        description: "जीडीपी ग्रोथ रेट में हुआ इजाफा, देश के विकास की कहानी।",
        content:
          "भारत की अर्थव्यवस्था ने मजबूती दिखाई है। जीडीपी ग्रोथ रेट में इजाफा हुआ है।",
        image:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
        category: "Business",
        tags: ["economy"],
        isFeatured: false,
      },
      {
        title: "बॉलीवुड की बड़ी खबर",
        description: "इस फिल्म ने बॉक्स ऑफिस पर मचाया धमाल",
        content:
          "बॉलीवुड की मच अवेटेड फिल्म ने बॉक्स ऑफिस पर धमाल मचा दिया है।",
        image:
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
        category: "Entertainment",
        tags: ["bollywood"],
        isFeatured: false,
      },
      {
        title: "International Summit में भारत",
        description: "भारत ने वैश्विक मंच पर उठाए अहम मुद्दे",
        content:
          "अंतर्राष्ट्रीय सम्मेलन में भारत ने जलवायु परिवर्तन पर अपनी बात रखी।",
        image:
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
        category: "International",
        tags: ["summit"],
        isFeatured: false,
      },
    ];

    const newsIds = [];
    for (const item of newsData) {
      const news = await News.create({
        ...item,
        author: admin._id,
        isPublished: true,
        publishedAt: new Date(),
      });
      newsIds.push(news._id);
    }
    console.log(`✅ ${newsData.length} news created`);

    // 3. Create Sliders
    console.log("\n🎠 Creating sliders...");
    const sliders = [
      {
        title: "भारत की अंतरिक्ष उपलब्धि",
        description: "जानिए कैसे भारत ने अंतरिक्ष में नया इतिहास रचा",
        image:
          "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200",
        order: 0,
        newsId: newsIds[0],
      },
      {
        title: "डिजिटल इंडिया क्रांति",
        description: "गांव-गांव पहुंच रही इंटरनेट की सुविधा",
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200",
        order: 1,
        newsId: newsIds[1],
      },
      {
        title: "IPL 2025 का रोमांच",
        description: "नए रिकॉर्ड और रोमांचक मुकाबलों का सीजन",
        image:
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200",
        order: 2,
        newsId: newsIds[2],
      },
    ];
    for (const s of sliders) {
      await Slider.create({ ...s, isActive: true, createdBy: admin._id });
    }
    console.log(`✅ ${sliders.length} sliders created`);

    // 4. Create Polls
    console.log("\n📊 Creating polls...");
    const polls = [
      {
        question: "देश के लिए सबसे महत्वपूर्ण मुद्दा क्या है?",
        category: "Politics",
        options: [
          { text: "रोजगार" },
          { text: "शिक्षा" },
          { text: "सुरक्षा" },
          { text: "पर्यावरण" },
        ],
        expiresAt: new Date("2025-06-30"),
      },
      {
        question: "क्या डिजिटल पेमेंट सिस्टम सुरक्षित है?",
        category: "Technology",
        options: [{ text: "हां" }, { text: "नहीं" }, { text: "कुछ हद तक" }],
        expiresAt: new Date("2025-06-30"),
      },
      {
        question: "आपकी पसंदीदा खेल शैली?",
        category: "Sports",
        options: [{ text: "क्रिकेट" }, { text: "फुटबॉल" }, { text: "हॉकी" }],
        expiresAt: new Date("2025-06-30"),
      },
    ];
    for (const p of polls) {
      await Poll.create({
        ...p,
        createdBy: admin._id,
        isActive: true,
        status: "active",
      });
    }
    console.log(`✅ ${polls.length} polls created`);

    console.log("\n🎉 Production seed completed!");
    console.log("📧 Admin: admin@janawaj.com / Admin@123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedProduction();
