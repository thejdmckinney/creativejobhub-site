// Media Library Integration for Page Editor
// This script connects the media library to the page editor for seamless file insertion

class MediaIntegration {
    constructor() {
        this.mediaLibraryUrl = 'index.html#media';
        this.selectedCallback = null;
        this.isInSelectMode = false;
        
        // Listen for messages from media library popup
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'MEDIA_SELECTED') {
                this.handleMediaSelection(event.data.media);
            }
        });
        
        // Check if we're in media selection mode
        this.checkSelectionMode();
    }
    
    // Check if page was opened in media selection mode
    checkSelectionMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const selectMode = urlParams.get('select_media');
        const callback = urlParams.get('callback');
        
        if (selectMode === 'true') {
            this.isInSelectMode = true;
            this.setupSelectionMode();
        }
    }
    
    // Setup media selection mode UI
    setupSelectionMode() {
        // Add selection instructions
        const banner = document.createElement('div');
        banner.className = 'media-selection-banner';
        banner.innerHTML = `
            <div style="background: #e3f2fd; color: #1565c0; padding: 15px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
                <strong>📸 Media Selection Mode</strong> - Click on any media file to insert it into your page
                <button onclick="window.close()" style="margin-left: 15px; padding: 5px 10px; background: #1565c0; color: white; border: none; border-radius: 4px;">Cancel</button>
            </div>
        `;
        
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Override media item clicks for selection
        this.overrideMediaClicks();
    }
    
    // Override media item clicks for selection mode
    overrideMediaClicks() {
        document.addEventListener('click', (event) => {
            if (!this.isInSelectMode) return;
            
            const mediaItem = event.target.closest('.media-item');
            if (mediaItem) {
                event.preventDefault();
                event.stopPropagation();
                
                const mediaData = this.extractMediaData(mediaItem);
                this.selectMedia(mediaData);
            }
        });
    }
    
    // Extract media data from DOM element
    extractMediaData(mediaItem) {
        const img = mediaItem.querySelector('img');
        const title = mediaItem.querySelector('.media-title');
        const size = mediaItem.querySelector('.media-size');
        
        return {
            id: mediaItem.dataset.id || Date.now().toString(),
            url: img ? img.src : '',
            name: title ? title.textContent : 'Media file',
            size: size ? size.textContent : '',
            type: img ? 'image' : 'file',
            alt: img ? img.alt || '' : '',
            timestamp: Date.now()
        };
    }
    
    // Select media and send to parent window
    selectMedia(mediaData) {
        if (window.opener) {
            window.opener.postMessage({
                type: 'MEDIA_SELECTED',
                media: mediaData
            }, '*');
            window.close();
        } else {
            // Fallback for same-window integration
            this.handleMediaSelection(mediaData);
        }
    }
    
    // Handle media selection
    handleMediaSelection(mediaData) {
        if (this.selectedCallback) {
            this.selectedCallback(mediaData);
        } else {
            // Default behavior: insert into active element
            this.insertMediaIntoEditor(mediaData);
        }
    }
    
    // Insert media into the page editor
    insertMediaIntoEditor(mediaData) {
        if (typeof selectedElement !== 'undefined' && selectedElement) {
            // If we have a selected element in the editor
            if (mediaData.type === 'image') {
                this.insertImage(selectedElement, mediaData);
            } else {
                this.insertFile(selectedElement, mediaData);
            }
        } else {
            // Insert at cursor or create new element
            this.insertAtCursor(mediaData);
        }
    }
    
    // Insert image into element
    insertImage(element, mediaData) {
        if (element.dataset.componentType === 'image') {
            // Replace placeholder with actual image
            element.innerHTML = `
                <img src="${mediaData.url}" 
                     alt="${mediaData.alt || mediaData.name}" 
                     class="component-image"
                     style="max-width: 100%; height: auto; border-radius: 8px;">
            `;
        } else {
            // Insert image into text content
            const img = document.createElement('img');
            img.src = mediaData.url;
            img.alt = mediaData.alt || mediaData.name;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.style.margin = '10px 0';
            
            element.appendChild(img);
        }
        
        this.showInsertionSuccess(mediaData.name);
    }
    
    // Insert file link into element
    insertFile(element, mediaData) {
        const link = document.createElement('a');
        link.href = mediaData.url;
        link.textContent = `📎 ${mediaData.name}`;
        link.style.display = 'inline-block';
        link.style.margin = '5px 0';
        link.style.padding = '8px 12px';
        link.style.background = '#f8f9fa';
        link.style.border = '1px solid #dee2e6';
        link.style.borderRadius = '4px';
        link.style.textDecoration = 'none';
        link.style.color = '#495057';
        
        element.appendChild(link);
        this.showInsertionSuccess(mediaData.name);
    }
    
    // Insert at cursor position
    insertAtCursor(mediaData) {
        // Create new component
        if (typeof createComponent !== 'undefined') {
            const component = createComponent('image');
            
            // Find a drop zone to insert into
            const dropZone = document.querySelector('.drop-zone');
            if (dropZone) {
                dropZone.replaceWith(component);
                
                // Add new drop zone
                const newDropZone = document.createElement('div');
                newDropZone.className = 'drop-zone';
                newDropZone.textContent = 'Drop components here';
                component.after(newDropZone);
                
                // Insert the media
                this.insertImage(component, mediaData);
            }
        }
    }
    
    // Show success message
    showInsertionSuccess(fileName) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = `✅ Inserted: ${fileName}`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    // Open media library for selection
    openMediaLibrary(callback = null) {
        this.selectedCallback = callback;
        
        const mediaWindow = window.open(
            this.mediaLibraryUrl + '&select_media=true',
            'mediaLibrary',
            'width=1000,height=700,scrollbars=yes,resizable=yes'
        );
        
        // Focus the media window
        if (mediaWindow) {
            mediaWindow.focus();
        }
        
        return mediaWindow;
    }
    
    // Quick image selector
    selectImage(callback = null) {
        return this.openMediaLibrary((mediaData) => {
            if (mediaData.type === 'image') {
                if (callback) callback(mediaData);
            } else {
                alert('Please select an image file.');
            }
        });
    }
    
    // Quick file selector
    selectFile(callback = null) {
        return this.openMediaLibrary(callback);
    }
    
    // Generate media HTML for insertion
    generateImageHTML(mediaData, options = {}) {
        const {
            width = 'auto',
            height = 'auto',
            className = 'inserted-image',
            style = ''
        } = options;
        
        return `<img src="${mediaData.url}" 
                     alt="${mediaData.alt || mediaData.name}" 
                     class="${className}"
                     style="max-width: 100%; width: ${width}; height: ${height}; ${style}">`;
    }
    
    // Generate file link HTML
    generateFileHTML(mediaData, options = {}) {
        const {
            text = null,
            className = 'file-link',
            target = '_blank'
        } = options;
        
        const linkText = text || `📎 ${mediaData.name}`;
        
        return `<a href="${mediaData.url}" 
                   class="${className}" 
                   target="${target}"
                   download="${mediaData.name}">${linkText}</a>`;
    }
    
    // Batch media operations
    handleMultipleSelection(callback) {
        // For future implementation of multiple file selection
        console.log('Multiple selection not yet implemented');
    }
}

// Initialize media integration
const mediaIntegration = new MediaIntegration();

// Global functions for easy access
window.openMediaLibrary = (callback) => mediaIntegration.openMediaLibrary(callback);
window.selectImage = (callback) => mediaIntegration.selectImage(callback);
window.selectFile = (callback) => mediaIntegration.selectFile(callback);

// Enhanced image selection for page editor
function selectImageForComponent(componentElement) {
    mediaIntegration.selectImage((mediaData) => {
        mediaIntegration.insertImage(componentElement, mediaData);
        
        // Update editor selection if needed
        if (typeof selectElement !== 'undefined') {
            selectElement(componentElement);
        }
    });
}

// Global function for image selection buttons
window.selectImageForComponent = selectImageForComponent;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaIntegration;
}