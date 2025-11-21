# 🚀 Quick Start Guide - EatWise Authentication

## Get Started in 3 Steps

### 1. Start the Development Server
```bash
npm start
```

### 2. Choose Your Platform
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Scan QR code with Expo Go app

### 3. Test the Authentication

#### Option A: Use Test Credentials (DummyJSON API)
```
Email: emily.johnson@x.dummyjson.com
Password: emilyspass
```

#### Option B: Register New Account
1. Tap "Register" on login screen
2. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Tap "Register"
4. You'll be redirected to login - use the credentials you just created

## What You'll See

### 1. Login Screen
- Clean, modern UI with email and password fields
- Show/hide password toggle
- Form validation with error messages
- "Don't have an account? Register" link

### 2. After Login → Main App
You'll see a bottom tab navigation with 4 screens:
- **Home**: Dashboard with stats and quick actions
- **Meals**: Add meal screen (placeholder)
- **Favorites**: Saved meals screen (placeholder)
- **Profile**: User profile with logout

### 3. Profile Screen
- Displays your username and email
- Account settings menu
- Preferences options
- **Logout button** (tap to test logout flow)

## Testing the Full Flow

### Test Persistent Login
1. Login with credentials
2. Close the app completely
3. Reopen the app
4. ✅ You should still be logged in (auto-restored from AsyncStorage)

### Test Logout
1. Go to Profile tab
2. Tap "Logout" button
3. Confirm logout
4. ✅ You'll be redirected to login screen

### Test Form Validation

**Login Screen:**
- Try submitting empty form → See "required" errors
- Enter invalid email → See "invalid email format" error
- Enter password < 6 chars → See "minimum 6 characters" error

**Register Screen:**
- Try submitting with mismatched passwords → See "passwords must match" error
- All validations from login also apply

## Troubleshooting

### Issue: "Network Error" or Login Fails
**Solution:** Check your internet connection. The app uses https://dummyjson.com for authentication.

### Issue: App crashes on startup
**Solution:** 
```bash
# Clear cache and restart
npm start --clear
```

### Issue: Red screen with errors
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

## Test Credentials Reference

| Email | Password | Name |
|-------|----------|------|
| emily.johnson@x.dummyjson.com | emilyspass | Emily Johnson |
| michael.williams@x.dummyjson.com | michaelwpass | Michael Williams |
| sophia.brown@x.dummyjson.com | sophiabpass | Sophia Brown |

## Features to Explore

✅ **Implemented:**
- Email/password login
- User registration
- Persistent login (AsyncStorage)
- Session restoration
- Form validation
- Logout functionality
- Protected routes
- Bottom tab navigation

🚧 **Coming Soon:**
- Add meal tracking
- Favorites management
- Profile editing
- Password reset
- Social authentication

## Project Structure Overview

```
app/
├── _layout.tsx              # Root layout with Redux & navigation
├── login.tsx                # Login screen ← Start here
├── register.tsx             # Registration screen
└── (tabs)/                  # Main app (requires login)
    ├── index.tsx            # Home screen
    ├── profile.tsx          # Profile with logout
    └── ...

store/
├── authSlice.ts             # Redux auth logic
└── index.ts                 # Store configuration

services/
└── api.ts                   # API calls (Axios)

utils/
└── storage.ts               # AsyncStorage helpers
```

## Need Help?

1. Check `AUTHENTICATION.md` for detailed documentation
2. Review code comments in each file
3. Check Redux state in React DevTools
4. Look for console logs in terminal

---

Happy coding! 🎉
