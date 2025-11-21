# 🚀 EatWise - Startup Guide

## Quick Start

### 1. Start the Development Server

```bash
npm start
```

This will start the Expo development server.

### 2. Choose Your Platform

Once the server starts, you'll see a QR code and menu options:

```
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project in editor
```

**For Android:**
- Press `a` (requires Android Studio + emulator)
- Or scan QR code with Expo Go app

**For iOS (Mac only):**
- Press `i` (requires Xcode)
- Or scan QR code with Expo Go app

**For Web:**
- Press `w` (opens in browser)

---

## 🎬 What to Expect

### App Launch Flow:

```
1. 📱 Splash Screen (1 second)
   ↓
2. 🔍 Check AsyncStorage for saved session
   ↓
   ├─→ Found session → Navigate to Home (Main App)
   └─→ No session → Navigate to Login Screen
```

---

## 🔐 Test Authentication

### Option 1: Use Test Credentials (Recommended)

The app uses DummyJSON API for testing. Use these credentials:

```
Email: emily.johnson@x.dummyjson.com
Password: emilyspass
```

Other test accounts:
```
Email: michael.williams@x.dummyjson.com
Password: michaelwpass

Email: sophia.brown@x.dummyjson.com
Password: sophiabpass
```

### Option 2: Register New Account

1. Tap "Register" on login screen
2. Fill in the form:
   - Username: `testuser` (min 3 chars)
   - Email: `test@example.com`
   - Password: `password123` (min 6 chars)
   - Confirm Password: `password123`
3. Tap "Register"
4. You'll see success alert and be redirected to login
5. Login with your new credentials

---

## 👀 Watch the Console

The app logs helpful information to help you understand the flow:

```
🔍 Checking for stored session...
✅ Found stored user: johndoe
🧭 Navigation check: { isLoggedIn: true, ... }
✅ Logged in, redirecting to main app
```

To see console logs:
- **Expo Dev Tools**: Open browser at http://localhost:8081
- **Terminal**: Logs appear in the terminal where you ran `npm start`
- **React Native Debugger**: Press `j` in terminal to open debugger

---

## 📱 Test the Full Flow

### 1. First Launch (No Saved Session)
- ✅ See splash screen
- ✅ Redirected to Login screen
- ✅ Login with test credentials
- ✅ Navigate to Home screen
- ✅ See bottom tabs (Home, Meals, Favorites, Profile)

### 2. Navigate Around
- ✅ Tap Home tab - See dashboard
- ✅ Tap Profile tab - See your user info
- ✅ Tap other tabs - See placeholder screens

### 3. Test Persistent Login
- ✅ Close app completely (swipe away)
- ✅ Reopen app
- ✅ See splash screen briefly
- ✅ **Auto-login** - Go directly to Home (no login screen!)
- ✅ Your username still shows in Home/Profile

### 4. Test Logout
- ✅ Go to Profile tab
- ✅ Scroll down and tap "Logout"
- ✅ Confirm in the alert
- ✅ Redirected to Login screen
- ✅ Session cleared from storage

### 5. Close and Reopen After Logout
- ✅ Close app
- ✅ Reopen app
- ✅ See splash screen
- ✅ Redirected to Login screen (no auto-login)

---

## 🎨 What You'll See

### Login Screen
- Clean white background
- "Welcome Back!" header
- Email input with icon
- Password input with show/hide toggle
- Green "Login" button
- "Don't have an account? Register" link

### Home Screen (After Login)
- Greeting: "Hello, [username]!"
- Today's stats card (calories, meals, water)
- Recent meals section (empty state for now)
- 4 quick action cards

### Profile Screen
- Circle avatar with username initial
- Display name and email
- Menu sections (Account, Preferences, About)
- Red "Logout" button at bottom
- Version number

---

## 🔧 Troubleshooting

### Issue: App shows blank/white screen
**Solution:**
```bash
# Clear Metro bundler cache
npm start --clear
```

### Issue: "Network Error" when logging in
**Solution:**
- Check your internet connection
- DummyJSON API requires internet access
- Try test credentials exactly as shown above

### Issue: App crashes on Android
**Solution:**
```bash
# Rebuild the app
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Issue: Can't see console logs
**Solution:**
- Check terminal where you ran `npm start`
- Or press `j` in terminal to open React Native debugger
- Or open http://localhost:8081 in browser

### Issue: Changes not reflecting
**Solution:**
- Press `r` in terminal to reload
- Or shake device and select "Reload"

---

## 📊 Debug Tools

### Check AsyncStorage (Chrome DevTools)
1. Open Chrome
2. Go to: chrome://inspect
3. Click "inspect" under your app
4. Go to: Application → Storage → AsyncStorage
5. Look for key: `@eatwise_user`

### Check Redux State
Use React DevTools or Redux DevTools to inspect:
```javascript
{
  auth: {
    user: { username, email, token },
    isLoggedIn: true/false,
    isLoading: false,
    error: null
  }
}
```

---

## 🎯 Expected Behavior

### ✅ On First Launch:
1. Splash screen (1 second)
2. No saved session
3. Show Login screen

### ✅ After Login:
1. Loading indicator during API call
2. Success → Navigate to Home
3. Show username in header
4. Bottom tabs visible and working

### ✅ On App Restart (While Logged In):
1. Splash screen (1 second)
2. Found saved session
3. Auto-login → Direct to Home
4. No login screen shown

### ✅ After Logout:
1. Confirmation alert
2. Clear storage and state
3. Redirect to Login
4. Next launch shows Login screen

---

## 📝 Test Checklist

- [ ] App launches without errors
- [ ] Splash screen appears
- [ ] Login screen shows
- [ ] Can login with test credentials
- [ ] Navigate to Home after login
- [ ] Username shows in Home screen
- [ ] All 4 tabs work
- [ ] Profile shows user info
- [ ] Can logout
- [ ] After logout, redirected to login
- [ ] Close app and reopen (while logged in)
- [ ] Auto-login works (no login screen)
- [ ] Close app and reopen (after logout)
- [ ] Login screen shows (no auto-login)

---

## 🚦 Status Indicators

Watch for these in console:

```
🔍 = Checking something
✅ = Success
❌ = Error
🔐 = Authentication action
🧭 = Navigation action
➡️ = Redirecting
🏠 = Home/Index screen
```

---

## 📞 Need Help?

If something isn't working:

1. **Check console logs** - They'll show what's happening
2. **Clear cache** - Run `npm start --clear`
3. **Check test credentials** - Use exactly as shown
4. **Check internet** - DummyJSON API requires connection
5. **Review documentation** - See AUTHENTICATION.md for details

---

## 🎉 You're Ready!

Run `npm start` and test the authentication flow!

The app should:
- ✅ Launch with splash screen
- ✅ Show login screen on first launch
- ✅ Allow login with test credentials
- ✅ Persist login across app restarts
- ✅ Allow logout
- ✅ Handle all navigation smoothly

**Enjoy testing! 🚀**
