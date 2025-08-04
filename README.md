# React + Vite + Tailwind CSS

A modern React application built with Vite and styled with Tailwind CSS, featuring a clean and organized project structure.

## 🚀 Features

- **React 18** - Latest React with hooks and concurrent features
- **Vite** - Lightning fast build tool with HMR (Hot Module Replacement)
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **ESLint** - Code linting for consistent code quality
- **Organized Structure** - Clean folder organization for scalable development

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.jsx     # Responsive navigation bar with auth buttons
│   ├── Header.jsx     # Simple navigation header component
│   ├── Button.jsx     # Reusable button component
│   └── index.js       # Component exports for easier imports
├── pages/             # Page components
│   ├── Home.jsx       # Landing page
│   ├── About.jsx      # About page
│   ├── AuthPage.jsx   # Authentication page with Firebase integration
│   └── index.js       # Page exports for easier imports
├── services/          # API calls and business logic
│   ├── firebase.js    # Firebase configuration and initialization
│   ├── firebaseService.js # Firebase Auth & Firestore operations
│   ├── api.js         # Base API service
│   ├── userService.js # User-related API calls
│   ├── utils.js       # Utility functions
│   └── index.js       # Service exports for easier imports
└── assets/            # Static assets (images, icons, etc.)
```

## 🛠️ Getting Started

### Prerequisites

Make sure you have Node.js installed (version 16 or higher).

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration is set up in `tailwind.config.js` and includes:

- Content scanning for all JS/JSX files
- Custom theme extensions
- Utility classes for rapid development

### Custom Styles

Add custom styles in `src/index.css` after the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles here */
```

## 🔥 Firebase Integration

This project includes complete Firebase integration for authentication and database operations.

### Setup Firebase

1. **Configure Firebase**: Replace placeholder values in `src/services/firebase.js` with your actual Firebase configuration
2. **Enable Authentication**: Enable Email/Password authentication in Firebase Console
3. **Set up Firestore**: Create a Firestore database with appropriate security rules

See the detailed setup guide in [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) for complete instructions.

### Firebase Services Available

- **Authentication**: Sign up, sign in, sign out, password reset
- **Firestore**: User document management, real-time data sync
- **Auth State Management**: Real-time authentication state monitoring

### Quick Usage Example

```jsx
import { firebaseService } from '../services';

// Sign up a new user
const handleSignUp = async (email, password) => {
  try {
    await firebaseService.signUp(email, password, { displayName: 'John Doe' });
    console.log('User created successfully!');
  } catch (error) {
    console.error('Sign up failed:', error.message);
  }
};

// Listen to auth state changes
useEffect(() => {
  const unsubscribe = firebaseService.onAuthStateChange((user) => {
    setCurrentUser(user);
  });
  return () => unsubscribe();
}, []);
```

## 🔧 Services

The `services` directory contains:

- **firebase.js** - Firebase app initialization and configuration
- **firebaseService.js** - Complete Firebase integration with Auth & Firestore:
  - User authentication (sign up, sign in, sign out)
  - Password reset and email verification
  - Firestore CRUD operations for user data
  - Real-time auth state listening
- **api.js** - Base API service with common HTTP methods
- **userService.js** - User authentication and management (generic)
- **utils.js** - Common utility functions (date formatting, validation, etc.)
- **index.js** - Centralized exports for easier service imports

## 📦 Components

Reusable components are organized in the `components` directory:

- **Navbar.jsx** - Modern responsive navigation bar with:
  - Logo with icon and text
  - Desktop navigation menu
  - Login/Signup buttons
  - Mobile hamburger menu with slide-down navigation
  - Sticky positioning and smooth transitions
- **Header.jsx** - Simple navigation header component
- **Button.jsx** - Customizable button component with multiple variants
- **index.js** - Centralized exports for easier component imports

### Component Usage Examples

```jsx
// Using the Navbar component
import { Navbar } from '../components';

function MyPage() {
  return (
    <div>
      <Navbar />
      {/* Your page content */}
    </div>
  );
}

// Using the Button component
import { Button } from '../components';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="lg" onClick={handleClick}>
        Primary Button
      </Button>
      <Button variant="secondary" size="sm">
        Secondary Button
      </Button>
    </div>
  );
}
```

## 📄 Pages

Page components represent different routes/views:

- **Home.jsx** - Landing page with feature showcase
- **About.jsx** - Information about the project and tech stack
- **AuthPage.jsx** - Complete authentication page with:
  - Email/password sign-up and login
  - Google OAuth integration
  - Smart authentication (tries sign-up first, falls back to login)
  - Beautiful gradient design with centered card layout
  - Real-time error handling and success messages
  - Loading states and form validation
- **index.js** - Centralized exports for easier page imports

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
