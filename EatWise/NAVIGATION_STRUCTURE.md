# EatWise Navigation Structure

## ✅ Completed User Authentication Feature

### Navigation Architecture

The app uses **Expo Router** (built on React Navigation) with a file-based routing structure.

---

## 📱 Navigation Flow

### 1. **Auth Stack Navigator** (Unauthenticated Users)

Located in `app/` directory:

- **Login Screen** (`app/login.tsx`)
  - Username/password authentication
  - Pre-filled with test credentials
  - Form validation with Formik + Yup
  - Redux integration for state management
  
- **Register Screen** (`app/register.tsx`)
  - User registration form
  - Email, username, password fields
  - Form validation
  - Auto-redirect to login after success

### 2. **Bottom Tab Navigator** (Authenticated Users)

Located in `app/(tabs)/` directory:

#### Tab 1: **Home** (`index.tsx`)
- **Icon:** Home icon
- **Purpose:** Logged meals list & dashboard
- **Features:**
  - Welcome header with username
  - Today's overview stats (calories, meals, water)
  - Recent meals list
  - Quick action buttons

#### Tab 2: **Add Meal** (`meals.tsx`)
- **Icon:** Plus-circle icon
- **Purpose:** Add & analyze meals
- **Features:**
  - Meal entry form
  - Calorie tracking
  - Nutrition analysis

#### Tab 3: **Favourites** (`favorites.tsx`)
- **Icon:** Heart icon
- **Purpose:** Saved frequent meals
- **Features:**
  - List of favorite meals
  - Quick access to commonly eaten foods

#### Tab 4: **Profile** (`profile.tsx`)
- **Icon:** User icon
- **Purpose:** User info + logout
- **Features:**
  - User profile information
  - Settings
  - Logout button with confirmation

---

## 🔐 Authentication System

### State Management
- **Redux Toolkit** for global auth state
- **AsyncStorage** for persistent login sessions
- **Auto-restore** sessions on app restart

### Protected Routes
The app automatically:
- Shows **Login Screen** for unauthenticated users
- Shows **Tab Navigator** for authenticated users
- Redirects based on auth state changes

### Authentication Flow
```
App Start → Check AsyncStorage → 
  ├─ User Found → Restore Session → Navigate to /(tabs)
  └─ No User → Navigate to /login

Login Success → Save to AsyncStorage → Navigate to /(tabs)

Logout → Clear AsyncStorage → Navigate to /login
```

---

## 📂 File Structure

```
app/
├── _layout.tsx              # Root layout with Redux Provider
├── index.tsx                # Entry point with splash screen
├── login.tsx                # Login screen (Auth Stack)
├── register.tsx             # Register screen (Auth Stack)
└── (tabs)/                  # Tab Navigator (Main App)
    ├── _layout.tsx          # Tab navigator configuration
    ├── index.tsx            # Home screen
    ├── meals.tsx            # Add Meal screen
    ├── favorites.tsx        # Favourites screen
    └── profile.tsx          # Profile screen

store/
└── authSlice.ts             # Redux authentication slice

services/
└── api.ts                   # API client (DummyJSON)

utils/
└── storage.ts               # AsyncStorage helpers

components/
└── SplashScreen.tsx         # Loading screen
```

---

## 🎨 Tab Bar Configuration

- **Active Color:** `#10b981` (Green)
- **Inactive Color:** `#9ca3af` (Gray)
- **Height:** 60px
- **Style:** Clean, modern with icons + labels

---

## 🧪 Testing the Authentication

### Test Credentials (DummyJSON API)

Use these pre-configured test accounts:

| Username | Password | Name |
|----------|----------|------|
| `emilys` | `emilyspass` | Emily Johnson |
| `michaelw` | `michaelwpass` | Michael Williams |
| `sophiab` | `sophiabpass` | Sophia Brown |

### Test Flow

1. **Open App** → See splash screen → Auto-redirect to Login
2. **Login** with test credentials → Navigate to Home tab
3. **Navigate** between tabs → Home, Add Meal, Favourites, Profile
4. **Check Profile** → See user info and logout button
5. **Logout** → Confirm → Return to Login screen
6. **Restart App** → Auto-login with saved session

---

## ✅ Completed Features

- [x] Redux Toolkit authentication store
- [x] AsyncStorage persistent sessions
- [x] Login screen with validation
- [x] Register screen with validation
- [x] Protected route navigation
- [x] Auto session restoration
- [x] Bottom tab navigator
- [x] Home screen with dashboard
- [x] Add Meal screen
- [x] Favourites screen
- [x] Profile screen with logout
- [x] Splash screen
- [x] API integration (DummyJSON)
- [x] TypeScript types
- [x] Error handling
- [x] Loading states

---

## 🚀 Next Steps (Future Enhancements)

1. **Connect to Production API** - Replace DummyJSON with your backend
2. **Implement Meal Tracking** - Add meal logging functionality
3. **Add Photo Upload** - Camera integration for food photos
4. **Nutrition Analysis** - Integrate nutrition API
5. **Progress Charts** - Add data visualization
6. **Push Notifications** - Meal reminders
7. **Offline Mode** - Local data caching

---

## 📱 How to Test

1. **Start the development server:**
   ```bash
   cd EatWise
   npm start
   ```

2. **Open in Expo Go:**
   - Scan QR code with Expo Go app
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

3. **Test the auth flow:**
   - Login with pre-filled credentials (emilys/emilyspass)
   - Navigate through all tabs
   - Go to Profile and logout
   - Close and reopen app (should auto-login)

---

## 💡 Technical Notes

- **Expo Router** provides file-based routing (cleaner than React Navigation config)
- **Redux Persist** handled manually with AsyncStorage
- **Protected Routes** implemented with navigation guards in `_layout.tsx`
- **Session Restoration** happens automatically on app start
- **Type Safety** enforced with TypeScript throughout

---

**Status:** ✅ User Authentication Feature is Complete and Fully Functional
