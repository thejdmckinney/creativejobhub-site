# Visual Editor Guide

Your website now has a **password-protected visual editor** that lets you or your team click on elements to edit them without writing any code!

## 🚀 Quick Start

### 1. Access Your Homepage
- Open: http://localhost:8000/index.html
- The editor is **hidden from public view** by default

### 2. Show the Login Button (Secret Shortcut)
- Press **`Ctrl+Shift+E`** (Windows/Linux) or **`Cmd+Shift+E`** (Mac)
- The **"🎨 Editor Login"** button will appear in the bottom-right corner
- This keeps the editor completely hidden from regular visitors

### 3. Login
- Click **"🎨 Editor Login"** button
- Enter password: `editor123` (or `creativejobhub`)
- Click **"Login"** button

### 4. Set Up Sanity Token (One-Time Setup)
**Important**: To save changes to Sanity, you need an API token.

**Get Your Token:**
1. Go to https://www.sanity.io/manage
2. Select "Creative Job Hub" project
3. Click **API** → **Tokens**
4. Click **Add API Token**
5. Name: "Visual Editor Token"
6. Permissions: **Editor**
7. Copy the token (you only see it once!)

**Set the Token:**
- Open browser console (F12)
- Run: `localStorage.setItem('sanityToken', 'your-token-here')`
- Replace `'your-token-here'` with your actual token

> **Note**: You only need to do this once per browser. The token persists until you clear browser data.

### 5. Enable Edit Mode
- After logging in, you'll see an editor toolbar at the top
- Click **"Enable Edit Mode"** button (it will turn green)
- Now you can edit elements on the page!

## ✏️ How to Edit Elements

### Editing Text, Headings, and Paragraphs
1. **Click any element** (headings, paragraphs, etc.)
   - It will get an orange outline when selected
2. **Edit panel appears** on the right side
3. You can change:
   - **Text Content** - Edit the actual text
   - **Text Color** - Click color picker to change color
   - **Font Size** - Use slider (10-72px)
4. Click **"Apply Changes"** to see changes immediately

### Editing Buttons and Links
1. **Click any button or link**
2. **Edit panel appears** with options for:
   - **Text Content** - Change button text
   - **Link URL** - Change where it goes
   - **Text Color** - Change text color
   - **Background Color** - Change button color
   - **Font Size** - Adjust text size
3. Click **"Apply Changes"**

### Editing Colors
- **Text Color**: Available for all text elements
- **Background Color**: Available for buttons and elements with `.btn` class
- Use the color picker to select any color you want

## 💾 Saving Your Changes

### Important: Two-Step Process
1. **Apply Changes** - Click this to see changes on the page (temporary)
2. **Save Changes** - Click this button in the toolbar to save permanently to Sanity

> **Note**: The "Save Changes" functionality will store your edits in Sanity so they persist across page reloads. Currently configured to save to your Sanity project (ID: 53m7wbm0).

## 🎨 Visual Feedback

- **Blue dashed outline** = Hovering over an editable element
- **Orange solid outline** = Element is selected and ready to edit
- **Green toolbar button** = Edit mode is active
- **Notifications** = Success/error messages appear in top-right corner

## 🔐 Security Features

- **Hidden by default** - Login button only appears with keyboard shortcut (`Ctrl+Shift+E` or `Cmd+Shift+E`)
- **Password protected** - Only people with the password can edit
- **Login persists** - You stay logged in until you click "Logout"
- **No accidental edits** - Must enable Edit Mode first
- **Invisible to visitors** - Website visitors won't see any editing UI unless they know the keyboard shortcut and password

## 🛠️ Toolbar Buttons

1. **Creative Job Hub logo** - Shows you're in the editor
2. **Page URL display** - Shows current page path
3. **Enable/Disable Edit Mode** - Toggle editing on/off (green when active)
4. **Save Changes** - Saves all edits to Sanity
5. **Logout** - Exit the editor

## 📱 Mobile Friendly

The visual editor works on mobile devices too:
- Edit panel becomes full-width on small screens
- Toolbar remains accessible
- All editing features work the same way

## 🔄 Workflow

### Typical Editing Session:
1. **Navigate** to the page you want to edit
2. **Press keyboard shortcut**: `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac)
3. **Click "🎨 Editor Login"** button that appears
4. **Login** with password
5. **Enable Edit Mode** (green button)
6. **Click element** you want to edit
7. **Make changes** in edit panel
8. **Apply Changes** to see them
9. **Repeat** for other elements
10. **Save Changes** when done
11. **Disable Edit Mode** or **Logout** when finished

## 🎯 What Can You Edit?

### Current Supported Elements:
- `<h1>` through `<h6>` - All heading levels
- `<p>` - Paragraphs
- `<a>` - Links
- `<button>` - Buttons
- Any element with class `.btn` - Button-styled elements

### Editable Properties:
- ✅ Text content
- ✅ Text color
- ✅ Background color (buttons)
- ✅ Font size
- ✅ Link URLs (for links and buttons)

## 🚀 Next Steps

### Adding Editor to Other Pages:
To add the visual editor to any other page, add these two lines before the closing `</head>` tag:

```html
<!-- Visual Editor Scripts -->
<script src="https://cdn.jsdelivr.net/npm/@sanity/client@6.22.7/dist/index.browser.js"></script>
<script src="/assets/js/visual-editor.js"></script>
```

### Changing the Password:
Edit `/assets/js/visual-editor.js` and change the password on line 8-9:
```javascript
// Default passwords (you can change these)
const DEFAULT_PASSWORDS = ['editor123', 'creativejobhub'];
```

### Team Access:
1. Share the **keyboard shortcut** (`Ctrl+Shift+E` or `Cmd+Shift+E`) with your team
2. Share the **password** with your team members
3. They can login and edit from any computer
4. All changes save to your Sanity project
5. Everyone sees the same content

> **Pro Tip**: Keep the keyboard shortcut secret! Only share it with people who need editing access.

## 🌐 Production Deployment

### When ready to use on live site (creativejobhub.com):
1. The editor scripts are already added to index.html
2. Just upload your site files to production
3. Make sure CORS is configured in Sanity (already done for creativejobhub.com)
4. Team members can login and edit from anywhere

## 💡 Tips

- **Start small** - Edit one element at a time and apply changes
- **Use color picker** - Click the color squares to open full color picker
- **Font size preview** - The slider shows the pixel size as you drag
- **Close panel** - Click the × to close edit panel without applying changes
- **Disable edit mode** - When done editing, turn off edit mode to browse normally
- **Save often** - Click "Save Changes" periodically to not lose work

## 🐛 Troubleshooting

### "🎨 Editor Login" button not appearing?
- Make sure you pressed the keyboard shortcut: `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
- Check browser console for errors (F12)
- Make sure both script tags are loaded
- Verify you're viewing through http://localhost:8000 (not file://)

### Already logged in but logged out accidentally?
- Press `Ctrl+Shift+E` (or `Cmd+Shift+E`) again
- The login button will reappear
- Login again with your password

### Changes not applying?
- Make sure Edit Mode is enabled (green button)
- Try clicking "Apply Changes" again
- Check that element is in the supported list (h1-h6, p, a, button, .btn)

### Colors not changing?
- Some elements might have inline styles that override
- Try using the developer tools to check CSS specificity
- Background color only works on buttons and .btn elements

## 📞 Support

If you need help or want to customize the editor further, just ask! The visual editor code is in:
- `/assets/js/visual-editor.js` - Main editor code
- Configuration is at the top of the file

---

**Enjoy your Wix-style visual editor!** 🎨✨
