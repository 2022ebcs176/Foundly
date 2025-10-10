# Foundly Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, will be installed with dependencies)
- For Android: Android Studio with Android SDK
- For iOS: macOS with Xcode

### Setup Commands

```bash
# Clone the repository
git clone https://github.com/2022ebcs176/Foundly.git
cd Foundly

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run web      # Web browser
npm run android  # Android emulator/device
npm run ios      # iOS simulator (macOS only)
```

## 📁 Project Structure

### `/app` - Screen Components
All screens use Expo Router for file-based routing:
- `index.tsx` - Splash screen (auto-redirects to login)
- `login.tsx` - User login
- `register.tsx` - User registration
- `home.tsx` - Main feed with items
- `post-lost.tsx` - Report lost items
- `post-found.tsx` - Report found items
- `_layout.tsx` - Root layout with navigation setup

### `/components` - Reusable UI Components
- `GradientButton.tsx` - Styled button with gradient
- `GradientBackground.tsx` - Gradient wrapper component
- `RoundedInput.tsx` - Text input with custom styling
- `CategoryPill.tsx` - Category filter chip
- `ItemCard.tsx` - Lost/found item display card
- `FloatingActionMenu.tsx` - Expandable floating action button

### `/constants` - App Constants
- `colors.ts` - Color palette and theme colors
- `mockData.ts` - Mock data for items (demo purposes)

### `/assets` - Static Assets
- `images/` - App icons, splash screen, and images

## 🎨 Styling Guide

### Color Palette
```typescript
primaryStart: "#5B6EF5"    // Gradient start
primaryEnd: "#4B3FD6"      // Gradient end
background: "#F4F6FF"       // App background
surface: "#FFFFFF"          // Card/surface color
textPrimary: "#1A1A1A"     // Main text
textSecondary: "#6E7191"   // Secondary text
lostBadge: "#FF5757"       // Lost item badge
foundBadge: "#4CAF50"      // Found item badge
```

### Typography
- **Display:** Josefin Sans (600 SemiBold)
- **Body:** Poppins (400 Regular, 500 Medium, 600 SemiBold)

### Component Patterns

#### Gradient Button Usage
```tsx
import { GradientButton } from "../components/GradientButton";

<GradientButton onPress={() => handleAction()}>
  Button Text
</GradientButton>
```

#### Input Field Usage
```tsx
import { RoundedInput } from "../components/RoundedInput";

<RoundedInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  keyboardType="email-address"
/>
```

#### Item Card Usage
```tsx
import { ItemCard } from "../components/ItemCard";

<ItemCard
  title="Lost Item"
  description="Description here"
  location="Location"
  timeAgo="2 hours ago"
  type="lost"
  image={require("path/to/image")}
  onPress={() => handlePress()}
/>
```

## 🔄 Navigation Flow

```
Splash (index.tsx)
    ↓ (2.4s delay)
Login (login.tsx) ←→ Register (register.tsx)
    ↓ (on login)
Home (home.tsx)
    ↓ (FAB menu)
    ├→ Post Lost (post-lost.tsx)
    └→ Post Found (post-found.tsx)
```

## 📱 State Management

Currently using React hooks for local state:
- `useState` for component state
- Mock data stored in `constants/mockData.ts`

### Adding New Items to Mock Data

Edit `constants/mockData.ts`:
```typescript
export const MOCK_ITEMS: Item[] = [
  {
    id: "unique-id",
    title: "Item Title",
    description: "Description",
    location: "Location Name",
    timeAgo: "1 hour ago",
    type: "lost" | "found",
    category: "Pets" | "Electronic" | "Documents" | "Accessories",
    image: require("../assets/images/image.png"),
    date: "2025-10-11",
  },
  // ... more items
];
```

## 🔌 API Integration (Future)

### Recommended Structure
```
/services
  ├── api.ts          # API client setup
  ├── auth.ts         # Authentication endpoints
  ├── items.ts        # Item CRUD operations
  └── users.ts        # User profile operations

/contexts
  ├── AuthContext.tsx # Authentication state
  └── ItemsContext.tsx # Items state management
```

## 🧪 Testing

### Running Tests (when implemented)
```bash
npm test
```

### Manual Testing Checklist
- [ ] Splash screen displays and transitions
- [ ] Login form validation works
- [ ] Register form validation works
- [ ] Home feed displays items
- [ ] Search functionality filters items
- [ ] Category filters work correctly
- [ ] FAB menu expands/collapses
- [ ] Post forms validate input
- [ ] Navigation between screens works

## 🐛 Common Issues & Solutions

### Issue: Metro bundler fails to start
**Solution:** Clear cache and restart
```bash
npm start -- --clear
```

### Issue: Fonts not loading
**Solution:** Ensure fonts are loaded before rendering
```tsx
const [fontsLoaded] = useFonts({...});
if (!fontsLoaded) return null;
```

### Issue: Images not displaying
**Solution:** Check image paths and use `require()` for local images
```tsx
image={require("../assets/images/icon.png")}
```

### Issue: Package version mismatch
**Solution:** Install recommended versions
```bash
npm install [package]@[version]
```

## 📦 Dependencies

### Core
- `expo` - Expo SDK
- `expo-router` - File-based routing
- `react-native` - React Native framework
- `react` - React library

### UI & Styling
- `expo-linear-gradient` - Gradient components
- `@expo/vector-icons` - Icon library
- `expo-font` - Custom fonts
- `@expo-google-fonts/josefin-sans` - Josefin Sans font
- `@expo-google-fonts/poppins` - Poppins font

### Navigation
- `@react-navigation/native` - Navigation library
- `react-native-screens` - Native screen components
- `react-native-safe-area-context` - Safe area handling

### Media
- `expo-image-picker` - Image selection
- `expo-image` - Optimized image component

## 🚢 Deployment

### Building for Production

#### Web
```bash
npm run build:web
```

#### Android APK
```bash
eas build --platform android
```

#### iOS IPA
```bash
eas build --platform ios
```

## 🤝 Contributing Guidelines

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request
5. Wait for review

### Commit Message Format
```
type(scope): subject

Examples:
feat(home): add search functionality
fix(login): resolve validation issue
style(button): update gradient colors
docs(readme): add setup instructions
```

## 📞 Support

For issues or questions:
- Team repository: https://github.com/2022ebcs176/Foundly
- Developer: Smruti Sourav Patel (2022ebcs058@online.bits-pilani.ac.in)

---

**Happy Coding! 🎉**
