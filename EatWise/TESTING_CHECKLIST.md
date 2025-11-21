# ✅ Authentication Testing Checklist

## Pre-Flight Check
- [ ] Dependencies installed (`npm install` completed)
- [ ] Dev server running (`npm start`)
- [ ] App launched on device/emulator

---

## 1. Login Screen Tests

### Valid Login
- [ ] Login with: `emily.johnson@x.dummyjson.com` / `emilyspass`
- [ ] Loading indicator appears during login
- [ ] Successfully navigates to Home screen
- [ ] Bottom tabs visible (Home, Meals, Favorites, Profile)

### Invalid Login
- [ ] Login with wrong password → Shows error message
- [ ] Login with invalid email format → Shows validation error
- [ ] Login with empty fields → Shows "required" errors

### UI/UX
- [ ] Password show/hide toggle works
- [ ] "Register" link navigates to register screen
- [ ] Form errors clear when editing
- [ ] Keyboard dismisses on submit

---

## 2. Registration Screen Tests

### Valid Registration
- [ ] Fill all fields correctly
- [ ] Username: `testuser` (3+ chars)
- [ ] Email: `test@eatwise.com` (valid format)
- [ ] Password: `password123` (6+ chars)
- [ ] Confirm Password: `password123` (matches)
- [ ] Shows success alert
- [ ] Redirects to login screen

### Invalid Registration
- [ ] Short username (< 3 chars) → Shows error
- [ ] Invalid email format → Shows error
- [ ] Short password (< 6 chars) → Shows error
- [ ] Mismatched passwords → Shows "passwords must match"
- [ ] Empty fields → Shows "required" errors

### UI/UX
- [ ] Password show/hide toggles work (both fields)
- [ ] "Login" link navigates back
- [ ] Form scrollable on small screens
- [ ] All validation messages clear

---

## 3. Navigation & Protected Routes

### After Login
- [ ] Automatically navigates to /(tabs)
- [ ] Cannot navigate back to login with back button
- [ ] All 4 tabs accessible

### After Logout
- [ ] Automatically redirects to login
- [ ] Cannot access tabs without login
- [ ] Login screen shown immediately

### Direct URL Access
- [ ] Try accessing `/(tabs)` when logged out → Redirects to login
- [ ] Try accessing `/login` when logged in → Redirects to tabs

---

## 4. Persistent Login Tests

### Session Persistence
- [ ] Login successfully
- [ ] Close app completely (swipe away)
- [ ] Reopen app
- [ ] Still logged in (no login screen shown)
- [ ] User data displayed in Profile

### Session Restoration
- [ ] Check AsyncStorage has user data: `@eatwise_user`
- [ ] Redux state restored on startup
- [ ] Username shown in Home screen header
- [ ] Email shown in Profile screen

---

## 5. Profile Screen Tests

### UI Display
- [ ] Avatar shows first letter of username
- [ ] Username displayed correctly
- [ ] Email displayed correctly
- [ ] All menu items visible
- [ ] Version number at bottom

### Logout Flow
- [ ] Tap "Logout" button
- [ ] Confirmation alert appears
- [ ] Tap "Logout" in alert
- [ ] Loading indicator appears (brief)
- [ ] Redirects to login screen
- [ ] AsyncStorage cleared (check with dev tools)

### Logout Cancellation
- [ ] Tap "Logout" button
- [ ] Tap "Cancel" in alert
- [ ] Stays on Profile screen
- [ ] Still logged in

---

## 6. Main App Screens (Tabs)

### Home Screen
- [ ] Displays "Hello, [username]!"
- [ ] Shows today's stats card
- [ ] Shows recent meals section (empty state)
- [ ] Shows 4 quick action cards
- [ ] All icons and styling correct

### Meals Screen
- [ ] Placeholder screen loads
- [ ] Shows "Add Meal" title
- [ ] Centered icon and text

### Favorites Screen
- [ ] Placeholder screen loads
- [ ] Shows "Favorites" title
- [ ] Shows empty state message

### Profile Screen
- [ ] Loads user data
- [ ] All menu sections visible
- [ ] Logout button at bottom

---

## 7. Form Validation Tests

### Email Validation
- [ ] `test` → Invalid
- [ ] `test@` → Invalid
- [ ] `test@email` → Invalid
- [ ] `test@email.com` → Valid ✓

### Password Validation
- [ ] `pass` → Too short
- [ ] `12345` → Too short
- [ ] `pass12` → Valid ✓

### Username Validation
- [ ] `ab` → Too short
- [ ] `abc` → Valid ✓

---

## 8. Error Handling Tests

### Network Errors
- [ ] Turn off internet
- [ ] Try to login
- [ ] Shows network error message
- [ ] Turn on internet
- [ ] Login works again

### API Errors
- [ ] Login with invalid credentials
- [ ] Shows "Invalid email or password"
- [ ] Error message styled with red background

---

## 9. Redux State Tests

### Login Action
- [ ] `isLoading: true` during login
- [ ] `isLoggedIn: true` after success
- [ ] `user` object populated
- [ ] `error: null` on success
- [ ] `error` set on failure

### Logout Action
- [ ] `isLoading: true` during logout
- [ ] `isLoggedIn: false` after logout
- [ ] `user: null` after logout
- [ ] `error: null` after logout

### Session Restoration
- [ ] Check `restoreSession` action dispatched
- [ ] State populated from AsyncStorage
- [ ] No loading delay on restoration

---

## 10. AsyncStorage Tests

### After Login
- [ ] Key `@eatwise_user` exists
- [ ] Contains: username, email, token
- [ ] Data is valid JSON

### After Logout
- [ ] Key `@eatwise_user` removed
- [ ] No auth data remaining

---

## 11. UI/UX Polish

### Animations & Transitions
- [ ] Screen transitions smooth
- [ ] No flickering during navigation
- [ ] Loading indicators visible during async ops

### Styling
- [ ] Consistent color scheme (green primary)
- [ ] Icons render correctly (Feather icons)
- [ ] Text readable on all backgrounds
- [ ] Proper spacing and padding

### Responsive Design
- [ ] Works on different screen sizes
- [ ] Keyboard doesn't cover inputs
- [ ] ScrollView works on small screens
- [ ] Safe area respected (notch/status bar)

---

## 12. Edge Cases

### Empty States
- [ ] No meals shown in Home → Shows empty state
- [ ] No favorites → Shows empty state message

### Long Usernames
- [ ] Username with 20+ characters displays properly
- [ ] Avatar initial correct for long names

### Special Characters
- [ ] Email with `+` symbol works
- [ ] Password with special chars works

### Rapid Actions
- [ ] Double-tap login → Only one request sent
- [ ] Rapid logout → Handles gracefully

---

## 13. Performance Tests

### App Launch
- [ ] Cold start < 3 seconds
- [ ] Splash screen shows briefly
- [ ] Smooth transition to first screen

### Login Speed
- [ ] Login request completes < 2 seconds
- [ ] No lag during navigation

### Memory
- [ ] No memory leaks during navigation
- [ ] App doesn't crash with repeated use

---

## 14. TypeScript Tests

### Type Safety
- [ ] No TypeScript errors in terminal
- [ ] All types properly imported
- [ ] Redux hooks typed correctly
- [ ] API responses typed

---

## Test Results Summary

### Pass Rate: _____ / _____ tests passed

### Issues Found:
1. 
2. 
3. 

### Notes:


---

## Quick Test Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting issues
npm run lint

# Clear cache and restart
npm start --clear

# Check AsyncStorage (Chrome DevTools)
# Application → Storage → AsyncStorage
```

---

**Tested By:** ________________  
**Date:** ________________  
**Platform:** ☐ iOS  ☐ Android  ☐ Web  
**Version:** 1.0.0
