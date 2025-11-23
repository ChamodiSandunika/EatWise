# 🥗 EatWise

**EatWise** is a smart meal tracking and nutrition management app built with React Native and Expo. Track your daily meals, monitor calorie intake, get personalized health advice, and maintain a healthy lifestyle with ease.

## ✨ Features

### 🍽️ Meal Tracking
- **Natural Language Input**: Add meals using plain text descriptions (e.g., "2 eggs and toast")
- **Automatic Nutrition Calculation**: Powered by API Ninjas Nutrition API
- **Meal History**: View and manage your complete meal history
- **Meal Details**: See detailed nutritional information for each meal
- **Favorites**: Save frequently eaten meals for quick access

### 📊 Progress Monitoring
- **Daily Summary**: Visual progress bars showing calories consumed vs. goal
- **Calorie Tracking**: Real-time calorie counter with goal tracking
- **Meal Count**: Track number of meals consumed per day
- **Over/Under Goal Indicators**: Visual feedback when exceeding or under daily goals

### 💡 Health & Personalization
- **Personalized Health Advice**: Get tailored tips based on your activity
- **Profile Management**: Update profile picture and personal information
- **Goal Setting**: Set and adjust daily calorie goals

### 🎨 User Experience
- **Dark Mode**: Full app-wide dark mode support with theme persistence
- **Beautiful UI**: Modern, clean interface with smooth animations
- **Tab Navigation**: Easy access to Home, Meals, Favorites, and Profile
- **Settings Pages**: Notifications, Privacy & Security, Help & Support

### 🔐 Authentication
- **Secure Login**: Powered by Clerk authentication
- **Email Verification**: Secure sign-up with email verification
- **Password Security**: Strong password requirements and validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EatWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add the following:
   ```env
   # Clerk Authentication
   # Get your publishable key from https://dashboard.clerk.com
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

   # API Ninjas Nutrition API
   # Get your API key from https://api-ninjas.com/api/nutrition
   EXPO_PUBLIC_API_NINJAS_KEY=your_api_ninjas_key_here
   ```

   **Required Environment Variables:**
   
   | Variable | Description | Where to Get |
   |----------|-------------|--------------|
   | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk authentication key for user login/signup | [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys |
   | `EXPO_PUBLIC_API_NINJAS_KEY` | API key for nutrition data extraction | [API Ninjas](https://api-ninjas.com/api/nutrition) → Sign Up → Get API Key |

4. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on your device**
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the QR code with Expo Go app

## 🔑 API Setup Guide

### 1. Clerk Authentication Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select existing one
3. Navigate to **API Keys** section
4. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
5. Add it to your `.env` file as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

### 2. API Ninjas Setup
1. Visit [API Ninjas](https://api-ninjas.com)
2. Sign up for a free account
3. Navigate to **My Account** → **API Key**
4. Copy your API key
5. Add it to your `.env` file as `EXPO_PUBLIC_API_NINJAS_KEY`

**Note:** The free tier of API Ninjas has rate limits. The app includes error handling for when the API is unavailable.

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
EatWise/
├── app/                        # App screens (file-based routing)
│   ├── (tabs)/                 # Tab navigation screens
│   │   ├── index.tsx           # Home screen (meal log)
│   │   ├── meals.tsx           # All meals view
│   │   ├── favorites.tsx       # Favorite meals
│   │   └── profile.tsx         # User profile
│   ├── sign-in.tsx             # Login screen
│   ├── sign-up.tsx             # Registration screen
│   ├── add-meal.tsx            # Add new meal
│   ├── meal-details.tsx        # Meal details view
│   ├── meal-history.tsx        # Meal history
│   ├── advice.tsx              # Health advice
│   ├── notifications.tsx       # Notifications settings
│   ├── privacy.tsx             # Privacy settings
│   └── help.tsx                # Help & support
├── components/                 # Reusable components
│   ├── DailySummary.tsx        # Daily calorie summary
│   ├── MealCard.tsx            # Meal display card
│   └── AdviceCard.tsx          # Health advice card
├── contexts/                   # React Context providers
│   └── ThemeContext.tsx        # Dark mode theme provider
├── store/                      # Redux store
│   ├── index.ts                # Store configuration
│   ├── mealsSlice.ts           # Meals state management
│   └── mealsSelectors.ts       # Redux selectors
├── services/                   # API services
│   └── api.ts                  # API client configuration
├── types/                      # TypeScript types
│   └── auth.types.ts           # Authentication types
├── utils/                      # Utility functions
│   └── storage.ts              # AsyncStorage helpers
├── assets/                     # Images, fonts, etc.
├── .env                        # Environment variables (not in git)
├── .env.example                # Example environment file
├── app.json                    # Expo configuration
└── package.json                # Dependencies
```

## 🎨 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Routing**: Expo Router (file-based routing)
- **State Management**: Redux Toolkit
- **Authentication**: Clerk
- **Storage**: AsyncStorage
- **API Client**: Axios
- **Icons**: @expo/vector-icons (Feather icons)
- **Forms**: Formik + Yup validation
- **Styling**: StyleSheet with dynamic theming

## 💾 Data Storage

The app uses AsyncStorage for local data persistence:

| Key | Description |
|-----|-------------|
| `@eatwise_meals` | All saved meals data |
| `@eatwise_profile_pic` | User profile picture URI |
| `@eatwise_theme` | Theme preference (light/dark) |
| `@eatwise_notification_settings` | Notification preferences |
| `@eatwise_privacy_settings` | Privacy preferences |

## 🌙 Dark Mode

EatWise includes full dark mode support:
- System-wide theme toggle
- Theme persistence across app restarts
- Optimized color schemes for readability
- All screens support both light and dark themes

## 🔧 Troubleshooting

### API Ninjas Errors
If you see "API is down for free users":
- The free tier has rate limits
- Try again later or upgrade to a paid plan
- You can still add meals manually

### Clerk Authentication Issues
- Ensure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is correctly set
- Check that your Clerk app is active in the dashboard
- Verify your internet connection

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For authorized contributors:
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ using React Native and Expo**
