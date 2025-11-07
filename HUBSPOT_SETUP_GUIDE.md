# HubSpot Forms & Exit-Intent Popup Setup Guide

## 🎯 Overview
This guide helps you replace your Formspree contact form with HubSpot forms and set up exit-intent popups for better lead tracking and conversion.

## ✅ Benefits of HubSpot Forms
- **Advanced Lead Tracking**: See visitor behavior, page views, and engagement
- **Automated Lead Scoring**: Qualify leads based on form submissions and activity
- **Email Automation**: Set up nurture sequences and follow-ups
- **Analytics & Reporting**: Track form performance, conversion rates, and ROI
- **CRM Integration**: Automatically create contacts and deals
- **Lead Attribution**: Know which marketing channels drive the best leads

---

## 🚀 Step 1: Create Contact Form in HubSpot

### 1.1 Access Forms Tool
1. Log into your HubSpot account
2. Navigate to **Marketing** > **Lead Capture** > **Forms**
3. Click **"Create form"**

### 1.2 Contact Form Setup
1. **Form Type**: Select **"Embedded form"**
2. **Form Name**: "Website Contact Form"
3. **Add Form Fields**:
   ```
   ✅ First name (required)
   ✅ Email (required) 
   ✅ Message (required, multi-line text)
   ✅ Company (optional)
   ✅ Phone number (optional)
   ```

### 1.3 Form Options
- **Thank You Message**: "Thanks! We'll get back to you within 24 hours."
- **Redirect URL**: Leave blank or set to `/thanks.html` (if you create a thank you page)
- **Notifications**: Enable email notifications to your team

### 1.4 Form Styling
- **Theme**: Choose theme that matches your dark site design
- **Colors**: 
  - Primary: `#0ea5e9` (your brand blue)
  - Background: `#111827` (your panel color)
  - Text: `#e5e7eb` (your text color)

### 1.5 Get Embed Code
1. Click **"Publish"** 
2. Choose **"Embed"**
3. Copy the embed code (looks like this):
   ```html
   <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
   <script>
     hbspt.forms.create({
       region: "na1",
       portalId: "YOUR_PORTAL_ID",
       formId: "YOUR_FORM_ID"
     });
   </script>
   ```

### 1.6 Replace Contact Form
1. Open `/contact.html` 
2. Find the comment: `<!-- REPLACE THIS COMMENT WITH YOUR HUBSPOT FORM EMBED CODE -->`
3. Replace the entire comment with your HubSpot embed code
4. Remove the fallback Formspree form

---

## 🎯 Step 2: Create Exit-Intent Popup

### 2.1 Create Popup Form
1. In HubSpot Forms, click **"Create form"**
2. Select **"Pop-up form"**
3. **Form Name**: "Exit Intent - Field Service Guide"

### 2.2 Popup Content Strategy
**Compelling Headlines** (A/B test these):
- "Wait! Get Our Free Field Service Efficiency Guide"
- "Don't Leave Empty-Handed - Get 10% Off Your First Month"
- "Boost Your Field Service ROI by 30% - Free Guide Inside"
- "Stop! Get Our Field Service Benchmarking Report"

**Lead Magnet Ideas**:
```
📊 Field Service ROI Calculator
📋 "10 Ways to Reduce No-Shows" Checklist  
📈 Industry Benchmarking Report
🎯 Field Service Efficiency Audit
💰 "Double Your Profit Margins" Guide
⚡ 30-Day Free Trial + Personal Setup Call
```

### 2.3 Form Fields (Keep Simple!)
```
✅ First name (required)
✅ Email (required)
✅ Company size (optional dropdown)
   - 1 person
   - 2-5 employees  
   - 6-20 employees
   - 20+ employees
```

### 2.4 Popup Trigger Settings
- **Trigger Type**: "Exit intent"
- **Display Frequency**: "Once per session" 
- **Time Delay**: 30 seconds (backup if no exit intent)
- **Target Pages**: "All pages" or specific high-value pages
- **Device Targeting**: "All devices" (mobile exit-intent works differently)

### 2.5 Design Settings
- **Position**: Center overlay
- **Size**: Medium (not too large)
- **Animation**: Slide up or fade in
- **Close Button**: Visible (don't trap visitors)

---

## 📧 Step 3: Setup Lead Nurturing

### 3.1 Create Contact Lists
1. Go to **Contacts** > **Lists**
2. Create these lists:
   ```
   📋 "Website Contact Form Submissions"
   📋 "Exit Intent Popup - Field Service Guide"
   📋 "High-Intent Prospects" (multiple form fills)
   ```

### 3.2 Email Automation
1. **Immediate Follow-up** (Contact Form):
   - Subject: "Thanks for contacting Creative Job Hub"
   - Include: Team intro, next steps, calendar link

2. **Lead Magnet Delivery** (Popup):
   - Subject: "Your Field Service Efficiency Guide is here!"
   - Include: Download link, additional resources

3. **Nurture Sequence** (Both):
   ```
   Day 1: Welcome + Lead Magnet
   Day 3: Case study or success story
   Day 7: Feature highlight + demo offer
   Day 14: Social proof + free trial
   Day 30: Last chance offer
   ```

### 3.3 Lead Scoring Setup
Award points for:
- Contact form submission: +20 points
- Popup form submission: +15 points  
- Pricing page visit: +10 points
- Multiple page visits: +5 points each
- Email opens: +1 point
- Email clicks: +3 points

---

## 📊 Step 4: Tracking & Analytics

### 4.1 Important Metrics to Track
```
📈 Form Conversion Rates:
   - Contact form: Target 2-5%
   - Exit popup: Target 1-3%

📊 Lead Quality Metrics:
   - Time to respond to leads
   - Lead-to-customer conversion rate
   - Revenue per lead

🎯 Popup Performance:
   - Views vs submissions
   - Exit intent trigger rate
   - Session duration before popup
```

### 4.2 HubSpot Dashboards
Create dashboards for:
- **Lead Generation**: Form submissions, sources, conversion rates
- **Sales Pipeline**: Deals created from website leads
- **Content Performance**: Most effective lead magnets

### 4.3 A/B Testing Ideas
Test these popup variations:
```
📝 Headlines: Benefit-focused vs urgency-based
🎨 Design: Different colors, sizes, animations  
⏰ Timing: Immediate vs 30s vs 60s delay
🎯 Offers: Free trial vs guide vs consultation
📱 Mobile: Different mobile experience
```

---

## 🛠 Step 5: Implementation Checklist

### ✅ Contact Form Replacement
- [ ] Create HubSpot contact form
- [ ] Get embed code
- [ ] Replace Formspree form in `/contact.html`
- [ ] Test form submission
- [ ] Verify lead appears in HubSpot
- [ ] Set up email notifications

### ✅ Exit-Intent Popup
- [ ] Create popup form in HubSpot
- [ ] Design compelling offer
- [ ] Set trigger rules (exit intent + 30s delay)
- [ ] Target appropriate pages
- [ ] Test popup functionality
- [ ] Create lead magnet content

### ✅ Lead Management
- [ ] Create contact lists
- [ ] Set up email automation
- [ ] Configure lead scoring
- [ ] Create follow-up sequences
- [ ] Train team on lead handling

### ✅ Analytics Setup
- [ ] Create tracking dashboards
- [ ] Set conversion goals
- [ ] Plan A/B testing schedule
- [ ] Set up weekly reporting

---

## 🎯 Pro Tips for Higher Conversions

### Contact Form Optimization
```
✅ Keep fields minimal (name, email, message)
✅ Use smart defaults (company from domain)
✅ Add trust signals ("We typically reply within 24 hours")
✅ Mobile-optimize for thumb-friendly buttons
✅ Use progressive profiling (ask more over time)
```

### Exit-Intent Popup Best Practices
```
✅ Offer genuine value (not just newsletter signup)
✅ Use urgency sparingly (don't be pushy)
✅ Make it easy to close (respect user choice)
✅ Mobile: Use different triggers (time-based)
✅ Don't show to existing customers (use smart rules)
```

### Lead Magnet Ideas by Industry Page
```
🌡️ HVAC: "Seasonal Maintenance Checklist"
🔧 Plumbing: "Emergency Response Playbook"  
⚡ Electrical: "Safety Compliance Guide"
🌿 Landscaping: "Seasonal Scheduling Template"
🛠️ Handyman: "Multi-Trade Pricing Guide"
```

---

## 🔧 Technical Notes

The contact.html file is already prepared with:
- HubSpot tracking code installed
- Placeholder for your form embed code
- Fallback Formspree form (remove after HubSpot setup)
- Mobile-responsive design

The main pages have:
- HubSpot tracking code installed  
- Exit-intent popup configuration ready
- Detailed setup instructions in comments

---

## 🆘 Troubleshooting

**Form Not Appearing:**
- Check HubSpot embed code for syntax errors
- Verify portal ID and form ID are correct
- Check browser console for JavaScript errors

**Popup Not Showing:**
- Verify popup is published and live in HubSpot
- Check targeting rules (pages, devices, frequency)
- Test in incognito mode (clears session data)

**Leads Not Tracking:**
- Confirm HubSpot tracking code is on all pages
- Check contact creation in HubSpot contacts
- Verify form fields match HubSpot properties

**Need Help?**
- HubSpot Academy has excellent tutorials
- HubSpot support chat is very responsive
- Test everything in incognito/private browsing mode

---

Ready to deploy? The infrastructure is in place - you just need to create the forms in HubSpot and add the embed codes!