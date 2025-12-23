# How Sanity Works with the Visual Editor

## 🎯 Quick Answer

**The visual editor works independently** - you can edit and see changes immediately. **Sanity is the "save button"** - it stores your changes so they persist when you reload the page.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Website (HTML)                       │
│  - Displays content from your HTML files                     │
│  - Visual editor overlays on top (when logged in)           │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Visual Editor (JavaScript)                      │
│  1. Click elements to edit (text, colors, buttons)          │
│  2. Changes appear LIVE on the page                         │
│  3. Tracks what you've edited                               │
│  4. Sends changes to Sanity when you click "Save"           │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼ (When you click "Save Changes")
┌─────────────────────────────────────────────────────────────┐
│                  Sanity CMS (Cloud)                          │
│  - Stores your edits in pageContent documents                │
│  - Each page has its own document                           │
│  - Remembers: text, colors, fonts, links                    │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼ (When page loads)
┌─────────────────────────────────────────────────────────────┐
│              Visual Editor Loads Saved Data                  │
│  - Checks Sanity for saved edits for this page              │
│  - Applies saved changes automatically                       │
│  - Your edits appear without re-editing                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 The Sanity Schema - `pageContent`

When you click "Save Changes", here's what gets stored in Sanity:

### Document Structure:
```javascript
{
  _type: "pageContent",           // Document type
  pageUrl: "/index.html",         // Which page this is for
  pageName: "Homepage",            // Friendly name
  updatedAt: "2025-12-23T...",    // When last saved
  elements: [                      // Array of edited elements
    {
      elementId: "main-heading",   // Element identifier
      elementType: "heading",      // Type: heading/text/button/link
      content: "Welcome!",         // The text content
      href: "https://...",         // Link URL (if applicable)
      styles: {                    // Style properties
        color: "rgb(255, 107, 53)",
        backgroundColor: "rgb(30, 58, 95)",
        fontSize: "48px",
        fontWeight: "700"
      }
    },
    // ... more edited elements
  ]
}
```

### You can see this in Sanity Studio:
1. Go to http://localhost:3333
2. Click "Page Content (Visual Editor)" in the sidebar
3. You'll see a document for each page you've edited
4. Click any document to see all the saved edits

---

## 🔄 How It Works Step-by-Step

### **Phase 1: Initial Page Load (Before Any Edits)**
1. ✅ Your HTML page loads normally
2. ✅ Visual editor JavaScript loads
3. ✅ If you're logged in, editor checks Sanity for saved changes
4. ✅ If saved changes exist, they're applied automatically
5. ✅ If no saved changes, page displays as normal

### **Phase 2: Making Edits (Live Changes)**
1. ✅ You press `Ctrl+Shift+E` to show login button
2. ✅ You login with password
3. ✅ You click "Enable Edit Mode"
4. ✅ You click an element (heading, button, etc.)
5. ✅ Edit panel appears with controls
6. ✅ You change text, color, or font size
7. ✅ You click "Apply Changes"
8. ✅ Changes appear IMMEDIATELY on the page
9. ⚠️ **Changes are temporary** - not saved yet
10. ✅ Element gets marked with `editor-edited` class

### **Phase 3: Saving to Sanity (Persistence)**
1. ✅ You click "Save Changes" in the toolbar
2. ✅ Visual editor collects all elements with `editor-edited` class
3. ✅ Creates/updates a `pageContent` document in Sanity
4. ✅ Sends data to Sanity API with authentication token
5. ✅ Sanity stores the changes
6. ✅ Notification: "Changes saved to Sanity!"
7. ✅ **Changes now persist** - they'll load on next visit

### **Phase 4: Returning to the Page**
1. ✅ You visit the page again (or refresh)
2. ✅ Visual editor checks Sanity for saved changes
3. ✅ Finds the `pageContent` document for this page
4. ✅ Automatically applies all saved edits
5. ✅ Your page looks exactly as you edited it

---

## 🔑 Authentication Token (Important!)

### **Why You Need It:**
- Sanity allows **READ** operations without authentication (fetching content)
- Sanity requires **WRITE** operations to be authenticated (saving content)
- The visual editor needs to **write** your changes to Sanity

### **How to Get Your Token:**

#### Option 1: Via Sanity CLI
```bash
cd creative-job-hub-cms
npx sanity debug --secrets
```
Copy the token that appears.

#### Option 2: Via Sanity Manage
1. Go to: https://www.sanity.io/manage
2. Select your project: "Creative Job Hub"
3. Go to **API** tab
4. Click **Tokens**
5. Click **Add API Token**
6. Name: "Visual Editor Token"
7. Permissions: **Editor**
8. Click **Add Token**
9. **Copy the token** (you can only see it once!)

### **How to Set the Token:**

Open your browser console (F12) and run:
```javascript
localStorage.setItem('sanityToken', 'your-token-here')
```

Or, we can add a UI in the login modal to paste it.

---

## 🎨 What You Can See in Sanity Studio

### **Before Any Edits:**
- Sanity Studio: http://localhost:3333
- You'll see the "Page Content (Visual Editor)" menu item
- It will be empty (no documents yet)

### **After Editing and Saving:**
1. Go to http://localhost:3333
2. Click "Page Content (Visual Editor)"
3. You'll see a document for each page you've edited:
   - "Homepage" (index.html)
   - "Pricing Page" (pricing.html)
   - etc.
4. Click any document to see:
   - Page URL
   - Page Name
   - List of all edited elements with their styles

### **Manual Editing in Studio:**
- You CAN manually edit the saved data in Sanity Studio
- Changes in Studio will appear on the website
- But it's easier to use the visual editor!

---

## 🔧 Technical Details

### **API Endpoints Used:**

1. **Fetch (Read):**
   ```javascript
   GET https://53m7wbm0.api.sanity.io/v2024-01-01/data/query/production
   Query: *[_type == "pageContent" && pageUrl == "/index.html"][0]
   ```
   - Used when page loads
   - No authentication needed
   - Returns saved edits for the current page

2. **Create (Write):**
   ```javascript
   POST https://53m7wbm0.api.sanity.io/v2024-01-01/data/mutate/production
   Body: { mutations: [{ create: { _type: "pageContent", ... } }] }
   Headers: { Authorization: "Bearer YOUR_TOKEN" }
   ```
   - Used when saving new page edits
   - Requires authentication token
   - Creates a new pageContent document

3. **Update (Write):**
   ```javascript
   POST https://53m7wbm0.api.sanity.io/v2024-01-01/data/mutate/production
   Body: { mutations: [{ patch: { id: "...", set: {...} } }] }
   Headers: { Authorization: "Bearer YOUR_TOKEN" }
   ```
   - Used when updating existing page edits
   - Requires authentication token
   - Updates existing pageContent document

### **Caching Strategy:**
- `useCdn: false` - Always fetch fresh data when editing
- No caching on writes - changes appear immediately
- When users visit your site, they can use CDN for fast reads

---

## 🚀 Current Implementation Status

### ✅ **What's Working:**
- Schema is created and deployed to Sanity
- Visual editor loads and tracks edits
- Elements can be edited and styled
- Changes appear live on the page
- Save function collects edited elements
- API calls to Sanity are implemented

### ⚠️ **What You Need to Do:**
1. **Get an API token** from Sanity (see instructions above)
2. **Set the token** in localStorage
3. **Test saving** by editing something and clicking "Save Changes"
4. **Verify in Sanity Studio** that a pageContent document was created

### 📝 **Next Steps (Optional Enhancements):**
- Add token management UI in the login modal
- Add a "Revert to Original" button to undo all changes
- Add a "Preview Mode" to see changes before saving
- Add a history log of edits in Sanity
- Add collaborative editing (multiple users editing at once)

---

## 💡 Benefits of This Architecture

### **Separation of Concerns:**
- ✅ Your HTML files stay clean and unchanged
- ✅ Visual editor works as an overlay
- ✅ Sanity stores just the differences/changes
- ✅ Original content is never lost

### **Flexibility:**
- ✅ Edit visually OR edit HTML code directly
- ✅ Changes can be made in Sanity Studio if needed
- ✅ Easy to add more pages - just include the scripts
- ✅ Works with any HTML website

### **Team Collaboration:**
- ✅ Multiple team members can edit different pages
- ✅ All edits stored centrally in Sanity
- ✅ Version history in Sanity (optional to enable)
- ✅ No need to deploy code for content changes

---

## 🔍 Debugging

### **To Check If Saving Works:**

1. Open browser console (F12)
2. Edit something and click "Save Changes"
3. Look for console logs:
   - ✅ "Saving changes to Sanity..."
   - ✅ "Changes saved to Sanity!"
   - ❌ If error: Check token is set correctly

### **To Check If Loading Works:**

1. Save some edits
2. Refresh the page
3. Look for console logs:
   - ✅ "No saved content for this page yet" (if first time)
   - ✅ Your changes should appear automatically
   - ❌ If edits don't appear: Check Sanity Studio for the document

### **Common Issues:**

**"401 Unauthorized"**
- Token is missing or invalid
- Get a new token from Sanity and set it again

**"Changes saved" but don't persist**
- Check Sanity Studio to see if document was created
- Verify the pageUrl matches exactly (case-sensitive)

**"No saved content" but you know you saved**
- Check the pageUrl in Sanity Studio document
- Make sure it matches the current page URL exactly

---

## 🎯 Summary

**Think of it like this:**

- **Your HTML** = The original content (never changes)
- **Visual Editor** = Your editing tool (works live, no saves needed for preview)
- **Sanity** = The memory (remembers your changes forever)
- **"Save Changes" button** = The sync button (copies edits to memory)
- **Page reload** = Recalls memory (loads saved edits from Sanity)

Everything works in the background - you don't need to do anything in Sanity Studio unless you want to manually view/edit the saved data. Just use the visual editor and click "Save Changes" when you're happy with your edits!
