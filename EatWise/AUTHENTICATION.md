# EatWise Authentication System

## Overview
Complete user authentication system for the EatWise mobile app built with React Native, Expo, Redux Toolkit, and AsyncStorage.

## Features Implemented

### ✅ Authentication Screens
- **LoginScreen** - Email/password authentication with validation
- **RegisterScreen** - New user registration with confirm password
- **ProfileScreen** - User profile with logout functionality

### ✅ State Management
- Redux Toolkit for global auth state
- AsyncStorage for persistent login sessions
- Automatic session restoration on app restart

### ✅ Navigation
- Protected routes with authentication checks
- Auth Stack (Login, Register)
- Main Tabs (Home, Meals, Favorites, Profile)
- Automatic redirect based on auth state

### ✅ Validation
- Email format validation
- Password minimum 6 characters
- Confirm password matching
- All fields required with error messages

### ✅ API Integration
- Axios client with interceptors
- DummyJSON API for login (https://dummyjson.com/auth/login)
- Mock registration API with delay simulation

## File Structure

```
EatWise/
├── app/
│   ├── _layout.tsx           # Root layout with Redux Provider & navigation protection
│   ├── index.tsx             # Splash screen with redirect logic
│   ├── login.tsx             # Login screen with Formik validation
│   ├── register.tsx          # Registration screen with validation
│   └── (tabs)/               # Main app tabs (protected)
│       ├── _layout.tsx       # Tab navigator configuration
│       ├── index.tsx         # Home screen
│       ├── meals.tsx         # Meals screen (placeholder)
│       ├── favorites.tsx     # Favorites screen (placeholder)
│       └── profile.tsx       # Profile screen with logout
├── store/
│   ├── index.ts              # Redux store configuration
│   └── authSlice.ts          # Auth slice with async thunks
├── services/
│   └── api.ts                # Axios client & API functions
├── utils/
│   └── storage.ts            # AsyncStorage helper functions
├── types/
│   └── auth.types.ts         # TypeScript type definitions
└── hooks/
    └── useAppDispatch.ts     # Typed Redux hooks
```

## Redux State Structure

```typescript
{
  auth: {
    user: {
      id: string | number;
      username: string;
      email: string;
      token: string;
      firstName?: string;
      lastName?: string;
    } | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
  }
}
```

## Usage Examples

### Login Flow
```typescript
const dispatch = useAppDispatch();

// Login with credentials
await dispatch(loginUser({ 
  email: 'user@example.com', 
  password: 'password123' 
})).unwrap();

// Auto-saves to AsyncStorage
// Auto-navigates to /(tabs) on success
```

### Registration Flow
```typescript
await dispatch(registerUser({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123'
})).unwrap();

// Shows success alert
// Redirects to login screen
```

### Logout Flow
```typescript
await dispatch(logoutUser()).unwrap();
// Clears AsyncStorage
// Clears Redux state
// Redirects to login screen
```

### Session Restoration
```typescript
// On app startup (automatic in _layout.tsx):
const storedUser = await getUserFromStorage();
if (storedUser) {
  dispatch(restoreSession(storedUser));
  // User stays logged in
}
```

## API Configuration

### DummyJSON Login
```typescript
// Test credentials:
username: 'emilys'  // (converted from email)
password: 'emilyspass'
```

### Customizing API
To use your own backend, update `services/api.ts`:

```typescript
const BASE_URL = 'https://your-api.com';

export const loginAPI = async (credentials: LoginCredentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};
```

## Environment Setup

### Dependencies Installed
```json
{
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "axios": "^1.x",
  "@react-navigation/native-stack": "^7.x",
  "formik": "^2.x",
  "yup": "^1.x"
}
```

### Run the App
```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Testing the Authentication

### Test Login Credentials (DummyJSON)
You can use any of these test users:

| Username | Password | Email |
|----------|----------|-------|
| emilys | emilyspass | emily.johnson@x.dummyjson.com |
| michaelw | michaelwpass | michael.williams@x.dummyjson.com |
| sophiab | sophiabpass | sophia.brown@x.dummyjson.com |

**Note:** Enter the email in the login form, it will be converted to username automatically.

### Test Registration
- Username: Any 3+ characters
- Email: Valid email format
- Password: Min 6 characters
- Confirm Password: Must match password

## Key Features Explained

### 1. Persistent Login
Uses AsyncStorage to save user data. On app restart, checks storage and restores session automatically.

### 2. Protected Routes
Navigation protection in `_layout.tsx` checks auth state and redirects:
- Not logged in → Login screen
- Logged in → Main tabs

### 3. Form Validation
Uses Formik + Yup for robust validation:
- Real-time error messages
- Touch-based validation (only shows errors after interaction)
- Schema-based validation rules

### 4. Error Handling
- API errors displayed in UI
- Network errors caught and displayed
- Loading states during async operations

### 5. Type Safety
Full TypeScript support with:
- Interface definitions for User, AuthState
- Typed Redux hooks
- Type-safe API calls

## Next Steps / Enhancements

1. **Forgot Password** - Add password reset flow
2. **Social Auth** - Add Google/Facebook login
3. **Biometric Auth** - Face ID / Fingerprint
4. **Token Refresh** - Implement token refresh logic
5. **Email Verification** - Add email verification step
6. **Profile Editing** - Allow users to update profile
7. **Avatar Upload** - Profile picture upload
8. **Better Error Messages** - More specific error feedback

## Troubleshooting

### Issue: User not redirecting after login
**Solution:** Check that Redux state is updating correctly. Use React DevTools to inspect state.

### Issue: Session not persisting
**Solution:** Verify AsyncStorage permissions and check storage helper functions are called.

### Issue: TypeScript errors
**Solution:** Run `npm install` to ensure all type definitions are installed.

### Issue: Navigation errors
**Solution:** Make sure all screens are properly registered in the Stack navigator.

## Security Considerations

⚠️ **For Production:**
1. Use HTTPS for all API calls
2. Implement token refresh mechanism
3. Add rate limiting for login attempts
4. Encrypt sensitive data in AsyncStorage
5. Implement proper token validation
6. Add CSRF protection
7. Use secure password requirements
8. Implement 2FA (Two-Factor Authentication)

## Support

For issues or questions about the authentication system, check:
- Redux Toolkit docs: https://redux-toolkit.js.org/
- Expo Router docs: https://docs.expo.dev/router/
- React Navigation docs: https://reactnavigation.org/

---

Built with ❤️ for EatWise
