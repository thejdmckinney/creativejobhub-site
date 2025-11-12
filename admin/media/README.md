# Creative Job Hub - Media Library

This directory stores uploaded media files from the admin dashboard.

## File Organization:
- `/images/` - Screenshots, photos, graphics
- `/videos/` - Demo videos, tutorials
- `/documents/` - PDFs, docs, other files
- `/app-screenshots/` - Actual app interface screenshots
- `/og-images/` - Generated Open Graph images

## Usage:
Files uploaded through the admin dashboard are automatically organized and can be referenced in your HTML using relative paths like:
```html
<img src="/admin/media/images/my-screenshot.png" alt="App screenshot">
```

## Security:
- Admin access required for uploads
- File type validation
- Size limits enforced
- No executable files allowed