/**
 * Visual Editor - Click-to-edit interface for Creative Job Hub
 * Allows logged-in users to edit content directly on the site
 */

// Configuration
const SANITY_PROJECT_ID = '53m7wbm0'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

class VisualEditor {
  constructor() {
    this.isEditMode = false
    this.isAuthenticated = false
    this.client = null
    this.pageUrl = window.location.pathname
    this.pageContent = null
    this.selectedElement = null
    
    this.init()
  }

  async init() {
    // Check if user is logged in to Sanity
    await this.checkAuth()
    
    if (this.isAuthenticated) {
      this.setupEditor()
    } else {
      // Check for URL parameter ?editor=true as easy access method
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('editor') === 'true') {
        this.showLoginButton()
      }
      
      // Also set up keyboard shortcut as backup
      this.setupKeyboardShortcut()
    }
  }

  setupKeyboardShortcut() {
    // Listen for Ctrl+Shift+E (or Cmd+Shift+E on Mac) to show login button
    document.addEventListener('keydown', (e) => {
      // Check for Ctrl/Cmd + Shift + E (case-insensitive)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e' || e.code === 'KeyE')) {
        e.preventDefault()
        const existingBtn = document.getElementById('visual-editor-login')
        if (!existingBtn) {
          this.showLoginButton()
        }
      }
    })
  }

  async checkAuth() {
    // Check if user has Sanity session
    try {
      // For now, we'll use localStorage to track login state
      // In production, you'd validate with Sanity
      this.isAuthenticated = localStorage.getItem('visualEditorAuth') === 'true'
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  showLoginButton() {
    // Add a discrete login button in the corner
    const loginBtn = document.createElement('button')
    loginBtn.id = 'visual-editor-login'
    loginBtn.innerHTML = '🎨 Editor Login'
    loginBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #1e3a5f, #ff6b35);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 999999;
      font-size: 14px;
      transition: transform 0.2s ease;
    `
    loginBtn.onmouseenter = () => loginBtn.style.transform = 'translateY(-2px)'
    loginBtn.onmouseleave = () => loginBtn.style.transform = 'translateY(0)'
    loginBtn.onclick = () => this.showLoginModal()
    
    document.body.appendChild(loginBtn)
  }

  showLoginModal() {
    const modal = document.createElement('div')
    modal.id = 'visual-editor-login-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999999;
    `
    
    modal.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 16px; max-width: 400px; width: 90%;">
        <h2 style="margin: 0 0 20px 0; color: #1e3a5f;">Visual Editor Login</h2>
        <p style="color: #666; margin-bottom: 20px;">Enter your editor password to access editing mode.</p>
        <input 
          type="password" 
          id="editor-password" 
          placeholder="Editor Password"
          style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; margin-bottom: 20px; box-sizing: border-box;"
        />
        <div style="display: flex; gap: 12px;">
          <button onclick="visualEditor.cancelLogin()" style="flex: 1; padding: 12px; background: #e5e7eb; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
          <button onclick="visualEditor.attemptLogin()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #1e3a5f, #ff6b35); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Login</button>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Default password: <code>editor123</code></p>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Focus password field
    document.getElementById('editor-password').focus()
    
    // Allow Enter key to login
    document.getElementById('editor-password').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.attemptLogin()
    })
  }

  attemptLogin() {
    const password = document.getElementById('editor-password').value
    
    // Simple password check (in production, validate with Sanity)
    if (password === 'editor123' || password === 'creativejobhub') {
      localStorage.setItem('visualEditorAuth', 'true')
      this.isAuthenticated = true
      this.cancelLogin()
      this.setupEditor()
    } else {
      alert('❌ Incorrect password. Try: editor123')
    }
  }

  cancelLogin() {
    const modal = document.getElementById('visual-editor-login-modal')
    if (modal) modal.remove()
  }

  setupEditor() {
    // Remove login button if it exists
    const loginBtn = document.getElementById('visual-editor-login')
    if (loginBtn) loginBtn.remove()
    
    // Initialize Sanity client
    this.initSanityClient()
    
    // Load page content
    this.loadPageContent()
    
    // Add editor toolbar
    this.createToolbar()
    
    // Add CSS for editor
    this.addEditorStyles()
  }

  initSanityClient() {
  const cdnUrl = 'https://cdn.jsdelivr.net/npm/@sanity/client@2.29.7/dist/sanityClient.min.js';
  let attempts = 0;
  const maxAttempts = 30; // ~15 seconds at 500ms interval
  const tryInit = () => {
    attempts++;
    const SanityClient = window.sanityClient || window.SanityClient || (window.sanity && window.sanity.client);
    if (!SanityClient) {
      if (attempts === 1) {
        // If script tag not present, inject it
        if (!document.querySelector('script[src*="sanityClient.min.js"]')) {
          const script = document.createElement('script');
          script.src = cdnUrl;
          script.async = false;
          script.onload = () => {
            console.log('🔄 Sanity CDN script loaded. Checking globals...');
            setTimeout(tryInit, 200);
          };
          document.head.appendChild(script);
          console.log('🔄 Injected Sanity CDN script');
        } else {
          // Script is present but not loaded yet
          setTimeout(tryInit, 500);
        }
      } else {
        // Wait for global to be set
        if (attempts < maxAttempts) {
          if (attempts % 3 === 0) {
            console.log(`[Sanity Init] Attempt ${attempts}: window.SanityClient=`, window.SanityClient, 'window.sanityClient=', window.sanityClient);
          }
          setTimeout(tryInit, 500);
        } else {
          console.error('❌ Sanity client failed to initialize after multiple attempts.');
        }
      }
      return;
    }
    // Try sanity_token first (what we told user to set), then fall back to sanityToken
    const token = localStorage.getItem('sanity_token') || localStorage.getItem('sanityToken');
    if (!token) {
      console.warn('⚠️ No Sanity token found. Please set it in console: localStorage.setItem("sanity_token", "your-token")');
    }
    try {
      if (typeof SanityClient === 'function') {
        this.client = SanityClient({
          projectId: SANITY_PROJECT_ID,
          dataset: SANITY_DATASET,
          useCdn: false,
          apiVersion: SANITY_API_VERSION,
          token: token,
        });
      } else if (SanityClient.createClient) {
        this.client = SanityClient.createClient({
          projectId: SANITY_PROJECT_ID,
          dataset: SANITY_DATASET,
          useCdn: false,
          apiVersion: SANITY_API_VERSION,
          token: token,
        });
      }
      console.log('✅ Sanity client initialized', token ? 'with token' : 'without token');
    } catch (error) {
      console.error('❌ Error initializing Sanity client:', error);
    }
  };
  tryInit();
}

  async loadPageContent() {
    if (!this.client) {
      console.warn('Sanity client not initialized')
      return
    }
    
    try {
      const content = await this.client.fetch(
        `*[_type == "pageContent" && pageUrl == $pageUrl][0]`,
        { pageUrl: this.pageUrl }
      )
      
      this.pageContent = content
      
      if (!content) {
        console.log('No saved content for this page yet')
      }
    } catch (error) {
      console.error('Error loading page content:', error)
    }
  }

  createToolbar() {
    const toolbar = document.createElement('div')
    toolbar.id = 'visual-editor-toolbar'
    toolbar.innerHTML = `
      <div class="toolbar-content">
        <div class="toolbar-left">
          <span class="toolbar-logo">🎨 Visual Editor</span>
          <span class="toolbar-page">${this.pageUrl}</span>
        </div>
        <div class="toolbar-right">
          <button onclick="visualEditor.toggleEditMode()" id="edit-mode-toggle" class="toolbar-btn toolbar-btn-primary">
            🖊️ Enable Edit Mode
          </button>
          <button onclick="visualEditor.saveChanges()" id="save-btn" class="toolbar-btn toolbar-btn-success" style="display:none;" disabled>
            💾 Save Changes
          </button>
          <button onclick="visualEditor.logout()" class="toolbar-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    `
    document.body.appendChild(toolbar)
    document.body.style.paddingTop = '70px'
    // If client is ready, enable save button
    setTimeout(() => this.updateSaveButtonState(), 500)
  }

  updateSaveButtonState() {
    const saveBtn = document.getElementById('save-btn')
    if (!saveBtn) return
    if (this.client) {
      saveBtn.disabled = false
      saveBtn.title = ''
    } else {
      saveBtn.disabled = true
      saveBtn.title = 'Sanity client not loaded yet. Please wait...'
      // Try again in 500ms
      setTimeout(() => this.updateSaveButtonState(), 500)
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode
    
    const toggle = document.getElementById('edit-mode-toggle')
    const saveBtn = document.getElementById('save-btn')
    
    if (this.isEditMode) {
      toggle.textContent = '👁️ Exit Edit Mode'
      toggle.classList.remove('toolbar-btn-primary')
      toggle.classList.add('toolbar-btn-warning')
      saveBtn.style.display = 'block'
      this.enableEditing()
    } else {
      toggle.textContent = '🖊️ Enable Edit Mode'
      toggle.classList.remove('toolbar-btn-warning')
      toggle.classList.add('toolbar-btn-primary')
      saveBtn.style.display = 'none'
      this.disableEditing()
    }
  }

  enableEditing() {
    // Make elements editable (including images)
    const editableSelectors = 'h1, h2, h3, h4, h5, h6, p, a, button, .btn, img'
    const elements = document.querySelectorAll(editableSelectors)
    
    elements.forEach((el, index) => {
      // Skip toolbar elements
      if (el.closest('#visual-editor-toolbar')) return
      if (el.closest('#visual-editor-login')) return
      
      // Add editable attribute
      el.setAttribute('data-editor-id', `element-${index}`)
      el.classList.add('editor-editable')
      
      // Add click handler
      el.addEventListener('click', (e) => this.handleElementClick(e, el))
    })
    
    // Show edit mode notification
    this.showNotification('✅ Edit mode enabled! Click on any element to edit it.', 'success')
  }

  disableEditing() {
    const editables = document.querySelectorAll('.editor-editable')
    editables.forEach(el => {
      el.classList.remove('editor-editable', 'editor-selected')
      el.removeAttribute('contenteditable')
    })
    
    // Remove edit panel
    const panel = document.getElementById('editor-panel')
    if (panel) panel.remove()
    
    this.selectedElement = null
  }

  handleElementClick(e, element) {
    if (!this.isEditMode) return
    
    e.preventDefault()
    e.stopPropagation()
    
    // Deselect previous
    const prevSelected = document.querySelector('.editor-selected')
    if (prevSelected) prevSelected.classList.remove('editor-selected')
    
    // Select this element
    element.classList.add('editor-selected')
    this.selectedElement = element
    
    // Show edit panel
    this.showEditPanel(element)
  }

  showEditPanel(element) {
    // Remove existing panel
    const existingPanel = document.getElementById('editor-panel')
    if (existingPanel) existingPanel.remove()
    
    // Check if element is part of a card component
    const card = this.findCardParent(element)
    if (card) {
      this.showCardEditor(card)
      return
    }
    
    const panel = document.createElement('div')
    panel.id = 'editor-panel'
    
    const tagName = element.tagName.toLowerCase()
    const isText = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(tagName)
    const isButton = tagName === 'button' || element.classList.contains('btn')
    const isLink = tagName === 'a'
    const isImage = tagName === 'img'
    
    panel.innerHTML = `
      <div class="panel-header">
        <h3>Edit ${tagName.toUpperCase()}</h3>
        <button onclick="visualEditor.closePanel()" class="panel-close">✕</button>
      </div>
      <div class="panel-body">
        ${isImage ? `
          <div class="panel-field">
            <label>Image Preview</label>
            <img src="${element.src}" alt="Preview" style="width: 100%; max-height: 150px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;" />
          </div>
          <div class="panel-field">
            <label>Image URL</label>
            <input type="text" id="edit-image-src" value="${element.src}" placeholder="https://example.com/image.jpg" />
          </div>
          <div class="panel-field">
            <label>Alt Text (for accessibility)</label>
            <input type="text" id="edit-image-alt" value="${element.alt || ''}" placeholder="Description of image" />
          </div>
          <div class="panel-field">
            <label>Width</label>
            <input type="text" id="edit-image-width" value="${element.style.width || element.getAttribute('width') || 'auto'}" placeholder="e.g., 100%, 500px, auto" />
          </div>
          <div class="panel-field">
            <label>Upload New Image</label>
            <input type="file" id="edit-image-upload" accept="image/*" style="width: 100%; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px;" />
            <small style="color: #666; display: block; margin-top: 4px;">Uploads to Sanity (coming soon)</small>
          </div>
        ` : ''}
        
        ${isText ? `
          <div class="panel-field">
            <label>Text Content</label>
            <textarea id="edit-text" rows="3">${element.textContent}</textarea>
          </div>
        ` : ''}
        
        ${isButton || isLink ? `
          <div class="panel-field">
            <label>Button Text</label>
            <input type="text" id="edit-text" value="${element.textContent}" />
          </div>
          <div class="panel-field">
            <label>Link URL</label>
            <input type="text" id="edit-href" value="${element.getAttribute('href') || ''}" />
          </div>
        ` : ''}
        
        ${!isImage ? `
          <div class="panel-field">
            <label>Text Color</label>
            <input type="color" id="edit-color" value="${this.rgbToHex(window.getComputedStyle(element).color)}" />
          </div>
        ` : ''}
        
        ${isButton ? `
          <div class="panel-field">
            <label>Background Color</label>
            <input type="color" id="edit-bgcolor" value="${this.rgbToHex(window.getComputedStyle(element).backgroundColor)}" />
          </div>
        ` : ''}
        
        ${!isImage ? `
          <div class="panel-field">
            <label>Font Size</label>
            <input type="range" id="edit-fontsize" min="10" max="72" value="${parseInt(window.getComputedStyle(element).fontSize)}" />
            <span id="fontsize-value">${parseInt(window.getComputedStyle(element).fontSize)}px</span>
          </div>
          
          <div class="panel-field">
            <label>Opacity (Transparency)</label>
            <input type="range" id="edit-opacity" min="0" max="100" step="5" value="${(parseFloat(window.getComputedStyle(element).opacity) || 1) * 100}" />
            <span id="opacity-value">${Math.round((parseFloat(window.getComputedStyle(element).opacity) || 1) * 100)}%</span>
            <small style="display: block; color: #666; margin-top: 4px;">100% = Fully visible, 0% = Invisible</small>
          </div>
          
          <div class="panel-field">
            <label>Animation / Transition</label>
            <select id="edit-animation" style="width: 100%; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px;">
              <option value="">No Animation</option>
              <option value="fadeIn 1s ease-in">Fade In</option>
              <option value="slideInUp 0.8s ease-out">Slide In Up</option>
              <option value="slideInDown 0.8s ease-out">Slide In Down</option>
              <option value="slideInLeft 0.8s ease-out">Slide In Left</option>
              <option value="slideInRight 0.8s ease-out">Slide In Right</option>
              <option value="bounce 1s ease">Bounce</option>
              <option value="pulse 1.5s infinite">Pulse (Continuous)</option>
              <option value="shake 0.5s ease">Shake</option>
              <option value="scale-up 0.3s ease">Scale Up (Hover effect)</option>
            </select>
          </div>
          
          <div class="panel-field">
            <label>Transition Duration (Hover effects)</label>
            <input type="range" id="edit-transition" min="0" max="1000" step="50" value="${parseInt(window.getComputedStyle(element).transitionDuration) * 1000 || 300}" />
            <span id="transition-value">${parseInt(window.getComputedStyle(element).transitionDuration) * 1000 || 300}ms</span>
          </div>
        ` : ''}
        
        <button onclick="visualEditor.applyChanges()" class="panel-btn">Apply Changes</button>
      </div>
    `
    
    document.body.appendChild(panel)
    
    // Add font size slider listener
    const fontSizeSlider = document.getElementById('edit-fontsize')
    if (fontSizeSlider) {
      fontSizeSlider.oninput = (e) => {
        document.getElementById('fontsize-value').textContent = e.target.value + 'px'
      }
    }
    
    // Add opacity slider listener
    const opacitySlider = document.getElementById('edit-opacity')
    if (opacitySlider) {
      opacitySlider.oninput = (e) => {
        document.getElementById('opacity-value').textContent = e.target.value + '%'
      }
    }
    
    // Add transition duration slider listener
    const transitionSlider = document.getElementById('edit-transition')
    if (transitionSlider) {
      transitionSlider.oninput = (e) => {
        document.getElementById('transition-value').textContent = e.target.value + 'ms'
      }
    }
  }

  applyChanges() {
    if (!this.selectedElement) return
    
    const text = document.getElementById('edit-text')
    const href = document.getElementById('edit-href')
    const color = document.getElementById('edit-color')
    const bgcolor = document.getElementById('edit-bgcolor')
    const fontsize = document.getElementById('edit-fontsize')
    const opacity = document.getElementById('edit-opacity')
    const animation = document.getElementById('edit-animation')
    const transition = document.getElementById('edit-transition')
    
    // Image-specific fields
    const imageSrc = document.getElementById('edit-image-src')
    const imageAlt = document.getElementById('edit-image-alt')
    const imageWidth = document.getElementById('edit-image-width')
    const imageUpload = document.getElementById('edit-image-upload')
    
    // Apply text/button/link changes
    if (text) this.selectedElement.textContent = text.value
    if (href) this.selectedElement.setAttribute('href', href.value)
    
    // For colors, we need to override both regular and gradient backgrounds
    if (color) {
      this.selectedElement.style.setProperty('color', color.value, 'important')
    }
    
    if (bgcolor) {
      // Override all background properties to ensure color sticks
      this.selectedElement.style.setProperty('background', bgcolor.value, 'important')
      this.selectedElement.style.setProperty('background-color', bgcolor.value, 'important')
      this.selectedElement.style.setProperty('background-image', 'none', 'important')
    }
    
    if (fontsize) this.selectedElement.style.setProperty('font-size', fontsize.value + 'px', 'important')
    
    // Apply opacity
    if (opacity) {
      const opacityValue = opacity.value / 100 // Convert percentage to 0-1 range
      this.selectedElement.style.setProperty('opacity', opacityValue, 'important')
    }
    
    // Apply animation changes
    if (animation) {
      if (animation.value) {
        this.selectedElement.style.setProperty('animation', animation.value, 'important')
      } else {
        this.selectedElement.style.removeProperty('animation')
      }
    }
    
    // Apply transition changes
    if (transition) {
      const duration = transition.value + 'ms'
      this.selectedElement.style.setProperty('transition', `all ${duration} ease`, 'important')
    }
    
    // Apply image changes
    if (imageSrc && imageSrc.value) {
      this.selectedElement.src = imageSrc.value
    }
    if (imageAlt) {
      this.selectedElement.alt = imageAlt.value
    }
    if (imageWidth && imageWidth.value) {
      this.selectedElement.style.width = imageWidth.value
    }
    if (imageUpload && imageUpload.files && imageUpload.files[0]) {
      // Handle local file upload - create a local preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.selectedElement.src = e.target.result
        this.selectedElement.classList.add('editor-edited')
        this.showNotification('⚠️ Image preview updated. Upload to Sanity coming soon!', 'info')
      }
      reader.readAsDataURL(imageUpload.files[0])
    }
    
    // Mark element as edited so it gets saved
    this.selectedElement.classList.add('editor-edited')
    
    // Create a persistent CSS rule to ensure styles stick
    this.createPersistentStyle(this.selectedElement)
    
    this.showNotification('✅ Changes applied! Click "Save Changes" to persist.', 'success')
    this.closePanel()
  }
  
  createPersistentStyle(element) {
    // Give element a unique ID if it doesn't have one
    if (!element.id) {
      element.id = `editor-elem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    // Get or create our custom style element
    let styleEl = document.getElementById('editor-persistent-styles')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'editor-persistent-styles'
      document.head.appendChild(styleEl)
    }
    
    // Get computed styles
    const color = element.style.color
    const bgcolor = element.style.backgroundColor || element.style.background
    const fontSize = element.style.fontSize
    const opacity = element.style.opacity
    
    // Create CSS rule with maximum specificity
    let cssRule = `#${element.id} {`
    if (color) cssRule += `color: ${color} !important;`
    if (bgcolor) {
      cssRule += `background: ${bgcolor} !important;`
      cssRule += `background-color: ${bgcolor} !important;`
      cssRule += `background-image: none !important;`
    }
    if (fontSize) cssRule += `font-size: ${fontSize} !important;`
    if (opacity) cssRule += `opacity: ${opacity} !important;`
    cssRule += `}`
    
    // Also add hover state to maintain colors
    if (bgcolor) {
      cssRule += `#${element.id}:hover {`
      cssRule += `background: ${bgcolor} !important;`
      cssRule += `background-color: ${bgcolor} !important;`
      cssRule += `background-image: none !important;`
      cssRule += `}`
    }
    
    // Append the rule
    styleEl.textContent += cssRule + '\n'
  }
  
  findCardParent(element) {
    // Look up the DOM tree for card-like containers
    let current = element
    let depth = 0
    const maxDepth = 10 // Don't go too far up
    
    while (current && current !== document.body && depth < maxDepth) {
      depth++
      
      // Check for common card class patterns
      const classList = current.className || ''
      const classStr = typeof classList === 'string' ? classList : classList.toString()
      
      // Expanded pattern matching for card-like containers
      if (classStr.match(/card|feature|pricing|testimonial|service|box|panel|item|block/i)) {
        // Verify it has card-like structure (has multiple children with content)
        const hasTitle = current.querySelector('h1, h2, h3, h4, h5, h6')
        const hasDescription = current.querySelector('p')
        const hasLink = current.querySelector('a')
        
        if (hasTitle || hasDescription) {
          return current
        }
      }
      
      // Also detect by structure: has border/background and contains heading + paragraph
      const style = window.getComputedStyle(current)
      const hasBorder = style.border && style.border !== 'none' && style.border !== '0px none rgb(0, 0, 0)'
      const hasBackground = style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent'
      const hasPadding = parseInt(style.padding) > 10
      
      if ((hasBorder || hasBackground) && hasPadding) {
        const title = current.querySelector('h1, h2, h3, h4, h5, h6')
        const description = current.querySelector('p')
        
        // Make sure there's actually content
        if (title && description) {
          // Make sure it's not too big (not a whole section)
          const rect = current.getBoundingClientRect()
          if (rect.width < window.innerWidth * 0.8) {
            return current
          }
        }
      }
      
      current = current.parentElement
    }
    return null
  }
  
  showCardEditor(card) {
    const panel = document.createElement('div')
    panel.id = 'editor-panel'
    
    // Extract card components
    const title = card.querySelector('h1, h2, h3, h4, h5, h6')
    const description = card.querySelector('p')
    const badge = card.querySelector('.badge, [class*="badge"]')
    const button = card.querySelector('a.btn, button, a[class*="btn"]')
    const cardBorder = window.getComputedStyle(card).border
    const cardBg = window.getComputedStyle(card).backgroundColor
    
    panel.innerHTML = `
      <div class="panel-header">
        <h3>Edit Card Component</h3>
        <button onclick="visualEditor.closePanel()" class="panel-close">✕</button>
      </div>
      <div class="panel-body">
        <div style="background: #f0f9ff; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 13px; color: #0369a1;">
            <strong>💡 Tip:</strong> Editing an entire card component with all its parts!
          </p>
        </div>
        
        ${title ? `
          <div class="panel-section">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #0f172a; font-weight: 600;">📋 Card Title</h4>
            <div class="panel-field">
              <label>Title Text</label>
              <input type="text" id="card-title-text" value="${title.textContent}" />
            </div>
            <div class="panel-field">
              <label>Title Color</label>
              <input type="color" id="card-title-color" value="${this.rgbToHex(window.getComputedStyle(title).color)}" />
            </div>
            <div class="panel-field">
              <label>Title Font Size</label>
              <input type="range" id="card-title-size" min="14" max="48" value="${parseInt(window.getComputedStyle(title).fontSize)}" />
              <span id="card-title-size-value">${parseInt(window.getComputedStyle(title).fontSize)}px</span>
            </div>
          </div>
        ` : ''}
        
        ${description ? `
          <div class="panel-section">
            <h4 style="margin: 16px 0 12px 0; font-size: 14px; color: #0f172a; font-weight: 600;">📝 Description</h4>
            <div class="panel-field">
              <label>Description Text</label>
              <textarea id="card-desc-text" rows="3">${description.textContent}</textarea>
            </div>
            <div class="panel-field">
              <label>Description Color</label>
              <input type="color" id="card-desc-color" value="${this.rgbToHex(window.getComputedStyle(description).color)}" />
            </div>
            <div class="panel-field">
              <label>Description Font Size</label>
              <input type="range" id="card-desc-size" min="12" max="24" value="${parseInt(window.getComputedStyle(description).fontSize)}" />
              <span id="card-desc-size-value">${parseInt(window.getComputedStyle(description).fontSize)}px</span>
            </div>
          </div>
        ` : ''}
        
        ${badge ? `
          <div class="panel-section">
            <h4 style="margin: 16px 0 12px 0; font-size: 14px; color: #0f172a; font-weight: 600;">🏷️ Badge</h4>
            <div class="panel-field">
              <label>Badge Text</label>
              <input type="text" id="card-badge-text" value="${badge.textContent}" />
            </div>
            <div class="panel-field">
              <label>Badge Color</label>
              <input type="color" id="card-badge-color" value="${this.rgbToHex(window.getComputedStyle(badge).color)}" />
            </div>
            <div class="panel-field">
              <label>Badge Background</label>
              <input type="color" id="card-badge-bg" value="${this.rgbToHex(window.getComputedStyle(badge).backgroundColor)}" />
            </div>
          </div>
        ` : ''}
        
        ${button ? `
          <div class="panel-section">
            <h4 style="margin: 16px 0 12px 0; font-size: 14px; color: #0f172a; font-weight: 600;">🔘 Button/Link</h4>
            <div class="panel-field">
              <label>Button Text</label>
              <input type="text" id="card-button-text" value="${button.textContent}" />
            </div>
            <div class="panel-field">
              <label>Button URL</label>
              <input type="text" id="card-button-url" value="${button.getAttribute('href') || ''}" placeholder="https://..." />
            </div>
            <div class="panel-field">
              <label>Button Text Color</label>
              <input type="color" id="card-button-color" value="${this.rgbToHex(window.getComputedStyle(button).color)}" />
            </div>
            <div class="panel-field">
              <label>Button Background</label>
              <input type="color" id="card-button-bg" value="${this.rgbToHex(window.getComputedStyle(button).backgroundColor)}" />
            </div>
          </div>
        ` : ''}
        
        <div class="panel-section">
          <h4 style="margin: 16px 0 12px 0; font-size: 14px; color: #0f172a; font-weight: 600;">🎨 Card Style</h4>
          <div class="panel-field">
            <label>Card Background</label>
            <input type="color" id="card-bg" value="${this.rgbToHex(cardBg)}" />
          </div>
          <div class="panel-field">
            <label>Border Color</label>
            <input type="color" id="card-border-color" value="#e5e7eb" />
          </div>
          <div class="panel-field">
            <label>Border Width</label>
            <input type="range" id="card-border-width" min="0" max="5" step="1" value="1" />
            <span id="card-border-width-value">1px</span>
          </div>
        </div>
        
        <button onclick="visualEditor.applyCardChanges()" class="panel-btn">Apply Card Changes</button>
      </div>
    `
    
    document.body.appendChild(panel)
    
    // Store reference to the card
    this.selectedCard = card
    this.selectedCardElements = { title, description, badge, button }
    
    // Add slider listeners
    const titleSizeSlider = document.getElementById('card-title-size')
    if (titleSizeSlider) {
      titleSizeSlider.oninput = (e) => {
        document.getElementById('card-title-size-value').textContent = e.target.value + 'px'
      }
    }
    
    const descSizeSlider = document.getElementById('card-desc-size')
    if (descSizeSlider) {
      descSizeSlider.oninput = (e) => {
        document.getElementById('card-desc-size-value').textContent = e.target.value + 'px'
      }
    }
    
    const borderWidthSlider = document.getElementById('card-border-width')
    if (borderWidthSlider) {
      borderWidthSlider.oninput = (e) => {
        document.getElementById('card-border-width-value').textContent = e.target.value + 'px'
      }
    }
  }
  
  applyCardChanges() {
    if (!this.selectedCard) return
    
    const { title, description, badge, button } = this.selectedCardElements
    
    // Apply title changes
    if (title) {
      const titleText = document.getElementById('card-title-text')
      const titleColor = document.getElementById('card-title-color')
      const titleSize = document.getElementById('card-title-size')
      
      if (titleText) title.textContent = titleText.value
      if (titleColor) {
        title.style.setProperty('color', titleColor.value, 'important')
        this.createPersistentStyle(title)
      }
      if (titleSize) {
        title.style.setProperty('font-size', titleSize.value + 'px', 'important')
        this.createPersistentStyle(title)
      }
      title.classList.add('editor-edited')
    }
    
    // Apply description changes
    if (description) {
      const descText = document.getElementById('card-desc-text')
      const descColor = document.getElementById('card-desc-color')
      const descSize = document.getElementById('card-desc-size')
      
      if (descText) description.textContent = descText.value
      if (descColor) {
        description.style.setProperty('color', descColor.value, 'important')
        this.createPersistentStyle(description)
      }
      if (descSize) {
        description.style.setProperty('font-size', descSize.value + 'px', 'important')
        this.createPersistentStyle(description)
      }
      description.classList.add('editor-edited')
    }
    
    // Apply badge changes
    if (badge) {
      const badgeText = document.getElementById('card-badge-text')
      const badgeColor = document.getElementById('card-badge-color')
      const badgeBg = document.getElementById('card-badge-bg')
      
      if (badgeText) badge.textContent = badgeText.value
      if (badgeColor) {
        badge.style.setProperty('color', badgeColor.value, 'important')
        this.createPersistentStyle(badge)
      }
      if (badgeBg) {
        badge.style.setProperty('background', badgeBg.value, 'important')
        badge.style.setProperty('background-color', badgeBg.value, 'important')
        badge.style.setProperty('background-image', 'none', 'important')
        this.createPersistentStyle(badge)
      }
      badge.classList.add('editor-edited')
    }
    
    // Apply button changes
    if (button) {
      const buttonText = document.getElementById('card-button-text')
      const buttonUrl = document.getElementById('card-button-url')
      const buttonColor = document.getElementById('card-button-color')
      const buttonBg = document.getElementById('card-button-bg')
      
      if (buttonText) button.textContent = buttonText.value
      if (buttonUrl) button.setAttribute('href', buttonUrl.value)
      if (buttonColor) {
        button.style.setProperty('color', buttonColor.value, 'important')
        this.createPersistentStyle(button)
      }
      if (buttonBg) {
        button.style.setProperty('background', buttonBg.value, 'important')
        button.style.setProperty('background-color', buttonBg.value, 'important')
        button.style.setProperty('background-image', 'none', 'important')
        this.createPersistentStyle(button)
      }
      button.classList.add('editor-edited')
    }
    
    // Apply card style changes
    const cardBg = document.getElementById('card-bg')
    const borderColor = document.getElementById('card-border-color')
    const borderWidth = document.getElementById('card-border-width')
    
    if (cardBg) {
      this.selectedCard.style.setProperty('background', cardBg.value, 'important')
      this.selectedCard.style.setProperty('background-color', cardBg.value, 'important')
    }
    if (borderColor && borderWidth) {
      const width = borderWidth.value + 'px'
      const color = borderColor.value
      this.selectedCard.style.setProperty('border', `${width} solid ${color}`, 'important')
    }
    
    this.selectedCard.classList.add('editor-edited')
    this.createPersistentStyle(this.selectedCard)
    
    this.showNotification('✅ Card changes applied! Click "Save Changes" to persist.', 'success')
    this.closePanel()
  }

  closePanel() {
    const panel = document.getElementById('editor-panel')

    if (panel) panel.remove()
  }

  async saveChanges() {
    if (!this.client) {
      this.showNotification('❌ Sanity client not loaded yet. Please wait a few seconds and try again.', 'error')
      this.updateSaveButtonState()
      return
    }
    this.showNotification('💾 Saving changes to Sanity...', 'info')
    try {
      // Collect all edited elements on the page
      const editedElements = []
      const allEditableElements = document.querySelectorAll('.editor-edited')
      allEditableElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element)
        const tagName = element.tagName.toLowerCase()
        const elementData = {
          _key: `element-${Date.now()}-${index}`,
          elementId: element.id || `${tagName}-${index}`,
          elementType: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName) ? 'heading' : 
                       tagName === 'button' || element.classList.contains('btn') ? 'button' :
                       tagName === 'a' ? 'link' :
                       tagName === 'img' ? 'image' : 'text',
          content: tagName === 'img' ? undefined : element.textContent,
          href: element.getAttribute('href') || undefined,
          styles: {
            color: computedStyle.color,
            backgroundColor: computedStyle.backgroundColor,
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight,
            opacity: computedStyle.opacity,
            animation: computedStyle.animation,
            transition: computedStyle.transition,
          }
        }
        // Add image-specific properties
        if (tagName === 'img') {
          elementData.imageSrc = element.src
          elementData.imageAlt = element.alt
          elementData.imageWidth = element.style.width || element.getAttribute('width') || undefined
        }
        editedElements.push(elementData)
      })
      // Create or update the pageContent document
      const pageContentDoc = {
        _type: 'pageContent',
        pageUrl: this.pageUrl,
        pageName: document.title,
        elements: editedElements,
        updatedAt: new Date().toISOString(),
      }
      // Query for existing document
      const query = `*[_type == "pageContent" && pageUrl == $pageUrl][0]`
      const existingDoc = await this.client.fetch(query, { pageUrl: this.pageUrl })
      if (existingDoc) {
        // Update existing document
        await this.client.patch(existingDoc._id).set(pageContentDoc).commit()
      } else {
        // Create new document
        await this.client.create(pageContentDoc)
      }
      this.showNotification('✅ Changes saved to Sanity!', 'success')
    } catch (error) {
      console.error('Save failed:', error)
      this.showNotification(`❌ Save failed: ${error.message}`, 'error')
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('visualEditorAuth')
      location.reload()
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `editor-notification editor-notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 16px 20px;
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999999;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  rgbToHex(rgb) {
    // Convert rgb(r, g, b) to #rrggbb
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    if (!match) return '#000000'
    
    const hex = (x) => {
      const hex = parseInt(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return '#' + hex(match[1]) + hex(match[2]) + hex(match[3])
  }

  addEditorStyles() {
    const style = document.createElement('style')
    style.textContent = `
      #visual-editor-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
        color: white;
        z-index: 999998;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      
      .toolbar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .toolbar-left, .toolbar-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .toolbar-logo {
        font-weight: 700;
        font-size: 18px;
      }
      
      .toolbar-page {
        color: #0891b2;
        font-size: 14px;
      }
      
      .toolbar-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        background: rgba(255,255,255,0.1);
        color: white;
      }
      
      .toolbar-btn:hover {
        transform: translateY(-1px);
        background: rgba(255,255,255,0.2);
      }
      
      .toolbar-btn-primary {
        background: linear-gradient(135deg, #0ea5e9, #06b6d4);
      }
      
      .toolbar-btn-success {
        background: linear-gradient(135deg, #22c55e, #16a34a);
      }
      
      .toolbar-btn-warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
      
      .editor-editable {
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .editor-editable:hover {
        outline: 2px dashed #0ea5e9;
        outline-offset: 4px;
        background: rgba(14, 165, 233, 0.05);
      }
      
      .editor-selected {
        outline: 3px solid #ff6b35 !important;
        outline-offset: 4px;
        background: rgba(255, 107, 53, 0.1) !important;
      }
      
      #editor-panel {
        position: fixed;
        right: 20px;
        top: 100px;
        width: 340px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 9999999;
        animation: slideIn 0.3s ease;
      }
      
      .panel-header {
        padding: 16px 20px;
        background: linear-gradient(135deg, #1e3a5f, #0f172a);
        color: white;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .panel-header h3 {
        margin: 0;
        font-size: 16px;
      }
      
      .panel-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: background 0.2s ease;
      }
      
      .panel-close:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .panel-body {
        padding: 20px;
        max-height: 500px;
        overflow-y: auto;
      }
      
      .panel-field {
        margin-bottom: 16px;
      }
      
      .panel-field label {
        display: block;
        font-weight: 600;
        margin-bottom: 6px;
        color: #1e3a5f;
        font-size: 13px;
      }
      
      .panel-section {
        padding-bottom: 16px;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 8px;
      }
      
      .panel-section:last-of-type {
        border-bottom: none;
      }
      
      .panel-field input,
      .panel-field textarea,
      .panel-field select {
        width: 100%;
        padding: 10px;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        font-family: inherit;
      }
      
      .panel-field input[type="color"] {
        height: 40px;
        padding: 4px;
      }
      
      .panel-field input[type="range"] {
        width: calc(100% - 60px);
        margin-right: 10px;
      }
      
      .panel-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #1e3a5f, #ff6b35);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
        transition: transform 0.2s ease;
      }
      
      .panel-btn:hover {
        transform: translateY(-2px);
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(20px);
        }
      }
      
      @media (max-width: 768px) {
        .toolbar-content {
          flex-direction: column;
          gap: 12px;
        }
        
        .toolbar-left, .toolbar-right {
          width: 100%;
          justify-content: center;
        }
        
        #editor-panel {
          left: 10px;
          right: 10px;
          width: auto;
        }
      }
      
      /* Animation Keyframes */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
      
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(10px);
        }
      }
    `
    
    document.head.appendChild(style)
  }
}

// Initialize visual editor
let visualEditor
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    visualEditor = new VisualEditor()
    window.visualEditor = visualEditor
  })
}
