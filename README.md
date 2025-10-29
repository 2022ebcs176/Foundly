# Foundly - Lost & Found App 📍

A mobile and web application built with React Native and Expo that helps users connect to find and return lost items.

## 👥 Team Information

**Team Member:**

**Name:** Smruti Sourav Patel

- **College ID:** 2022ebcs058
- **Email:** <2022ebcs058@online.bits-pilani.ac.in>
- **GitHub:** [ssouravpatel058](https://github.com/ssouravpatel058)
- **Role:** Frontend Development

**Name:** Bhavya Jain

- **College ID:** 2022ebcs176
- **Email:** <2022ebcs176@online.bits-pilani.ac.in>
- **GitHub:** [2022ebcs176](https://github.com/2022ebcs176)
- **Role:** Backend Development

**Name:** Vikas Singhal

- **College ID:** 2022ebcs183
- **Email:** <2022ebcs183@online.bits-pilani.ac.in>
- **GitHub:**
- **Role:** UI/UX Designer

**Name:** Tushar Sharma

- **College ID:** 2022ebcs182
- **Email:** <2022ebcs182@online.bits-pilani.ac.in>
- **GitHub:**
- **Role:** Testing and Integration

**Repository:** [Foundly](https://github.com/2022ebcs176/Foundly.git)

## 📋 Work Done Weekly with Dates

| Timeline | Contributors | Work Done |
|----------|-------------|-----------|
| Month 1 (September 2025) | All Team Members | Planning and structure of the app finalized |
| Week 1 (by 04/10/2025) | Vikas Singhal | UI/UX design for the app completed |
| Week 2 (by 11/10/2025) | Bhavya Jain | Project initialization |
| Week 2 (by 11/10/2025) | Smruti Sourav Patel | Worked on the Frontend of main app |
| Week 3 (by 18/10/2025) | Tushar Sharma | Tested and reported issues in frontend |
| Week 3 (by 18/10/2025) | Smruti Sourav Patel | Fixed reported issues, Frontend almost complete |
| Week 4 (by 25/10/2025) | All Team Members | Festival break - minimal work done |

## 🎯 About Foundly

Foundly is an app where users can:

- Post about lost items they're searching for
- Post about found items they've discovered
- Browse a feed of lost and found items
- Filter items by category (Pets, Electronics, Documents, Accessories)
- Search for specific items
- Connect with others to facilitate item exchanges

## 🚀 Features

### ✅ Implemented Screens

1. **Splash Screen** - Beautiful gradient splash with app logo
2. **Login Screen** - User authentication with email/password
3. **Register Screen** - New user sign up with validation
4. **Home Screen** - Main feed with:
   - Search functionality
   - Category filters
   - Lost/Found item cards
   - Floating action button
   - Bottom navigation
5. **Post Lost Item** - Form to report lost items with:
   - Image upload
   - Description
   - Location picker
   - Date picker
6. **Post Found Item** - Form to report found items

### 🎨 UI Components

- `GradientButton` - Reusable gradient button
- `GradientBackground` - Gradient background wrapper
- `RoundedInput` - Styled input fields
- `CategoryPill` - Filter category chips
- `ItemCard` - Lost/found item display cards
- `FloatingActionMenu` - Expandable FAB menu

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/2022ebcs176/Foundly.git
cd Foundly
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## 🖥️ Running the App

### Web

```bash
npm run web
```

Then open [http://localhost:8081](http://localhost:8081) in your browser.

### Android

```bash
npm run android
```

Requires Android Studio and Android emulator or physical device.

### iOS

```bash
npm run ios
```

Requires macOS and Xcode.

## 📱 App Structure

```
Foundly/
├── app/                      # App screens (Expo Router)
│   ├── _layout.tsx          # Root layout with navigation
│   ├── index.tsx            # Splash screen
│   ├── login.tsx            # Login screen
│   ├── register.tsx         # Register screen
│   ├── home.tsx             # Main feed screen
│   ├── post-lost.tsx        # Post lost item form
│   └── post-found.tsx       # Post found item form
├── assets/                   # Images and static assets
│   └── images/              # App icons and images
├── components/              # Reusable UI components
│   ├── CategoryPill.tsx
│   ├── FloatingActionMenu.tsx
│   ├── GradientBackground.tsx
│   ├── GradientButton.tsx
│   ├── ItemCard.tsx
│   └── RoundedInput.tsx
├── constants/               # App constants
│   ├── colors.ts            # Color palette
│   └── mockData.ts          # Mock data for demo
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

## 🎨 Design

The app design is based on Figma mockups with:

- **Primary Colors:** Blue gradient (#5B6EF5 to #4B3FD6)
- **Typography:** Josefin Sans for headings, Poppins for body
- **Theme:** Modern, clean, user-friendly interface
- **Responsive:** Adapts to different screen sizes

## � Note

This project is part of an academic assignment.

---

**Made with ❤️ by Team Foundly**
