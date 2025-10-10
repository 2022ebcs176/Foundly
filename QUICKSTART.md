# Quick Start Guide - Foundly App 🚀

## Running the App

### For Web (Easiest)
```bash
npm run web
```
Then open: http://localhost:8081

### For Android
1. Open Android Studio
2. Start an Android emulator
3. Run: `npm run android`

### For iOS (macOS only)
```bash
npm run ios
```

## Test Credentials

Use these for quick testing:
- **Email:** smruti@foundly.com
- **Password:** lost&found123

## Navigation Flow

1. **Splash Screen** → Auto-redirects after 2.4 seconds
2. **Login** → Enter credentials or click "Sign up"
3. **Register** → Create account (frontend demo - no backend)
4. **Home** → Browse lost/found items
5. **Post Item** → Click the blue floating button (+) to post

## Features to Try

### Search & Filter
- Use search bar to find items
- Click category pills to filter (Pets, Electronic, Documents, Accessories)

### Browse Items
- Scroll through the feed
- See LOST (red badge) and FOUND (green badge) items
- Each card shows image, title, description, location, and time

### Post Items
1. Click the blue floating (+) button
2. Choose "Post Lost Item" or "Post Found Item"
3. Fill in the form:
   - Upload image (optional - picker will open)
   - Add description
   - Enter location
   - Select date
4. Click submit button

## Project Structure Overview

```
app/
├── index.tsx       → Splash screen
├── login.tsx       → Login page
├── register.tsx    → Sign up page
├── home.tsx        → Main feed
├── post-lost.tsx   → Report lost items
└── post-found.tsx  → Report found items

components/         → Reusable UI components
constants/          → Colors and mock data
assets/images/      → App icons and images
```

## Keyboard Shortcuts

When dev server is running:
- `w` - Open in web browser
- `a` - Open in Android
- `r` - Reload app
- `m` - Toggle developer menu

## Common Commands

```bash
npm start           # Start dev server (choose platform)
npm run web         # Start for web
npm run android     # Start for Android
npm run ios         # Start for iOS
npm install         # Install dependencies
npm run lint        # Run linter
```

## Troubleshooting

### Metro bundler won't start?
```bash
npm start -- --clear
```

### Port already in use?
Kill the process using port 8081 or use a different port:
```bash
npm start -- --port 8082
```

### Changes not reflecting?
Press `r` in the terminal to reload the app.

## What's Working (Demo Frontend)

✅ Splash screen with auto-redirect  
✅ Login form with validation  
✅ Register form with validation  
✅ Home feed with item cards  
✅ Search functionality  
✅ Category filters  
✅ **Location selector modal** with multiple cities  
✅ **Filter & Sort modal** (Lost/Found/All items)  
✅ Floating action menu  
✅ Post lost/found item forms  
✅ Form validation  
✅ **User profile screen** with settings  
✅ **Item detail view** with full information  
✅ Interactive buttons and navigation  
✅ Bottom navigation bar  
✅ Bookmark functionality (mockup)  
✅ Contact poster feature (mockup)  
✅ Share item feature (mockup)  
✅ Report item feature (mockup)  
✅ Responsive design  

## What's Not Implemented (Backend Required)

❌ Actual user authentication  
❌ Real data persistence  
❌ Image upload to server  
❌ Real user profiles with data  
❌ Chat/messaging between users  
❌ Push notifications  
❌ Real-time updates  
❌ Actual location services/GPS  

## Next Steps for Full Implementation

1. Set up backend API (Node.js/Express, Firebase, or Supabase)
2. Implement authentication (JWT tokens)
3. Create database schema for users and items
4. Add image storage (AWS S3, Cloudinary)
5. Implement real-time features (WebSockets)
6. Add push notifications
7. Deploy to production

## Need Help?

- Check DEVELOPMENT.md for detailed documentation
- Check README.md for project overview
- Contact: Smruti Sourav Patel (2022ebcs058@online.bits-pilani.ac.in)

---

**Enjoy exploring Foundly! 🎉**
