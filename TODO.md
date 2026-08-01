# Fix Google Login & Remove Facebook Login

> Written by Developer

## Task

Fix Google login to work reliably and remove Facebook login entirely.

## Steps

- [ ] 1. Fix Google login in `client/src/hooks/useSocialAuth.js` — switch from One Tap to reliable popup OAuth2 flow
- [ ] 2. Remove Facebook login from `client/src/hooks/useSocialAuth.js`
- [ ] 3. Remove Facebook login from `client/src/context/AuthContext.jsx`
- [ ] 4. Remove Facebook button from `client/src/pages/Login.jsx`
- [ ] 5. Remove Facebook button from `client/src/pages/Signup.jsx`
- [ ] 6. Remove Facebook endpoint from `server/routes/socialAuth.js`
- [ ] 7. Remove `facebookId` from `server/models/User.js`
- [ ] 8. Verify build with `npm run build` in `client/`
