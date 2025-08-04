# Firebase Setup Guide

This guide will help you configure Firebase for your React application.

## 🔥 Firebase Configuration

### Step 1: Get Your Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **begins-guide (Begins Guide)**
3. Click on the gear icon ⚙️ → **Project settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** → **Web** (</>) → Register your app
6. Copy the configuration object

### Step 2: Update Firebase Configuration

Replace the placeholder values in `src/services/firebase.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // Your actual API key
  authDomain: "begins-guide.firebaseapp.com", // Your actual auth domain
  projectId: "begins-guide", // Your actual project ID
  storageBucket: "begins-guide.appspot.com", // Your actual storage bucket
  messagingSenderId: "123456789", // Your actual sender ID
  appId: "1:123456789:web:abc123", // Your actual app ID
  measurementId: "G-XXXXXXXXX" // Your actual measurement ID (optional)
};
```

### Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the sign-in providers you want to use:
   - ✅ **Email/Password** (recommended)
   - Google, Facebook, Twitter, etc. (optional)

### Step 4: Set up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Start in production mode**
4. Select a location for your database

### Step 5: Configure Firestore Security Rules

Update your Firestore rules in the Firebase Console or in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add more rules as needed for your collections
  }
}
```

## 🚀 Usage Examples

### Authentication

```javascript
import firebaseService from '../services/firebaseService';

// Sign up a new user
const handleSignUp = async (email, password, displayName) => {
  try {
    await firebaseService.signUp(email, password, { displayName });
    console.log('User created successfully!');
  } catch (error) {
    console.error('Sign up failed:', error.message);
  }
};

// Sign in an existing user
const handleSignIn = async (email, password) => {
  try {
    await firebaseService.signIn(email, password);
    console.log('User signed in successfully!');
  } catch (error) {
    console.error('Sign in failed:', error.message);
  }
};

// Sign out
const handleSignOut = async () => {
  try {
    await firebaseService.signOut();
    console.log('User signed out successfully!');
  } catch (error) {
    console.error('Sign out failed:', error.message);
  }
};

// Listen to auth state changes
useEffect(() => {
  const unsubscribe = firebaseService.onAuthStateChange((user) => {
    if (user) {
      console.log('User is signed in:', user);
    } else {
      console.log('User is signed out');
    }
  });

  return () => unsubscribe(); // Cleanup subscription
}, []);
```

### Firestore Operations

```javascript
import firebaseService from '../services/firebaseService';

// Get current user's data
const getCurrentUserData = async () => {
  const user = firebaseService.getCurrentUser();
  if (user) {
    try {
      const userData = await firebaseService.getUserDocument(user.uid);
      console.log('User data:', userData);
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  }
};

// Update user profile
const updateUserProfile = async (updateData) => {
  const user = firebaseService.getCurrentUser();
  if (user) {
    try {
      await firebaseService.updateUserDocument(user.uid, updateData);
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }
};
```

## 🔐 Environment Variables (Recommended)

For better security, consider storing your Firebase configuration in environment variables:

1. Create a `.env.local` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

2. Update `src/services/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

3. Add `.env.local` to your `.gitignore` file

## 🚀 Deployment

Since you have Firebase Hosting configured, you can deploy your app:

```bash
# Build your React app
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)

## 🆘 Common Issues

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution**: Make sure you've replaced the placeholder values in your Firebase configuration.

### Issue: "Missing or insufficient permissions"
**Solution**: Check your Firestore security rules and make sure they allow the operations you're trying to perform.

### Issue: "Firebase: Error (auth/operation-not-allowed)"
**Solution**: Enable the authentication method in Firebase Console → Authentication → Sign-in method.