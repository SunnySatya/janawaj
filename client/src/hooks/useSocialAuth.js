import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook for handling Google OAuth login flow on the client side.
 * Uses Google Identity Services (GIS) OAuth2 token client with popup flow,
 * which is more reliable than One Tap.
 */
const useSocialAuth = () => {
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | null
  const [socialError, setSocialError] = useState(null);
  const gsiScriptLoaded = useRef(false);

  // Preload the Google Identity Services script on mount so that by the time
  // the user clicks "Sign in with Google", the script is already loaded and
  // the popup opens within the user gesture (prevents popup blockers).
  useEffect(() => {
    if (window.google?.accounts || gsiScriptLoaded.current) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gsiScriptLoaded.current = true;
    };
    script.onerror = () => {
      console.error("Failed to preload Google Identity Services");
    };
    document.body.appendChild(script);
  }, []);

  /**
   * Dynamically load Google Identity Services script
   */
  const loadGoogleScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        gsiScriptLoaded.current = true;
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        gsiScriptLoaded.current = true;
        resolve();
      };
      script.onerror = () =>
        reject(new Error("Failed to load Google Identity Services"));
      document.body.appendChild(script);
    });
  }, []);

  /**
   * Decode Google JWT credential to get user info
   */
  const decodeGoogleCredential = (credential) => {
    try {
      const base64Url = credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Failed to decode Google credential:", err);
      return null;
    }
  };

  /**
   * Login with Google
   * Uses Google Identity Services OAuth2 popup flow (initTokenClient + requestAccessToken)
   * which reliably opens a Google account chooser popup.
   */
  const loginWithGoogle = useCallback(async () => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
      setSocialError(
        "Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file.",
      );
      return;
    }

    setSocialLoading("google");
    setSocialError(null);

    try {
      await loadGoogleScript();

      // Create a promise that resolves with the credential
      const credentialResponse = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Google login timed out. Please try again."));
        }, 60000);

        // Use the token client approach which opens a popup for account selection
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          prompt: "select_account",
          callback: (response) => {
            clearTimeout(timeout);
            if (response.access_token) {
              resolve(response);
            } else {
              reject(new Error("No credential received from Google"));
            }
          },
          error_callback: (error) => {
            clearTimeout(timeout);
            reject(new Error(error?.message || "Google login was cancelled"));
          },
        });

        // Request access token - this opens a popup for user to select account
        client.requestAccessToken();
      });

      // Use the access token to get user info from Google's userinfo endpoint
      const userInfoRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${credentialResponse.access_token}`,
          },
        },
      );

      const userInfo = userInfoRes.data;

      // Send to backend
      const res = await axios.post("/api/auth/google", {
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.sub,
        avatar: userInfo.picture || "",
      });

      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setSocialLoading(null);
      return { success: true, user, token };
    } catch (err) {
      console.error("Google login error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Google login failed. Please try again.";
      setSocialError(message);
      setSocialLoading(null);
      return { success: false, message };
    }
  }, [loadGoogleScript]);

  return {
    loginWithGoogle,
    socialLoading,
    socialError,
    setSocialError,
  };
};

export default useSocialAuth;
