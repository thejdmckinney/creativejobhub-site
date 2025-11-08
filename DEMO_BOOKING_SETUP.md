# Demo Booking Calendar Setup Guide

## 🎯 Overview
This guide helps you set up a professional demo booking calendar to convert website visitors into qualified leads through scheduled demos.

## 📅 Best Calendar Booking Options

### **Option 1: HubSpot Meetings (RECOMMENDED)**
- **Cost:** FREE with your existing HubSpot account
- **Integration:** Perfect with your existing HubSpot tracking
- **Features:** CRM integration, lead scoring, automated follow-ups
- **Best for:** Since you already have HubSpot installed

### **Option 2: Calendly**
- **Cost:** Free plan available, Pro $8/month
- **Features:** Professional appearance, lots of integrations
- **Best for:** Most popular, lots of customization options

### **Option 3: Cal.com**
- **Cost:** Free self-hosted, or $12/month hosted
- **Features:** Open source, highly customizable
- **Best for:** Full control and white-labeling

---

## 🚀 Setup Instructions

### **HubSpot Meetings Setup (Recommended)**

#### Step 1: Create Meeting Link
1. Log into your HubSpot account
2. Go to **Conversations** > **Meetings**
3. Click **"Create meeting link"**

#### Step 2: Configure Meeting Details
```
Meeting Name: "Field Service Software Demo"
Duration: 15 minutes
Description: "See Creative Job Hub in action with a personalized demo tailored to your field service business"

Meeting Type: "One-on-one"
Location: "Video call (Google Meet/Zoom)"
Buffer Time: 5 minutes before and after
```

#### Step 3: Set Availability
```
Available Hours: Mon-Fri, 9 AM - 5 PM (your timezone)
Buffer Between Meetings: 15 minutes
Max Meetings Per Day: 8
Lead Time: 2 hours (minimum booking notice)
```

#### Step 4: Add Qualifying Questions
```
Required Questions:
- Company name
- Number of technicians
- Current software (if any)
- Biggest field service challenge

Optional Questions:
- Industry (HVAC, Plumbing, Electrical, etc.)
- Monthly service calls
- Phone number
```

#### Step 5: Customize Confirmation
```
Confirmation Email Subject: "Your Creative Job Hub Demo is Confirmed!"

Email Message:
"Hi [First Name],

Thanks for booking a demo! We're excited to show you how Creative Job Hub can streamline your field service operations.

What to expect:
✅ 15-minute personalized demo
✅ See the platform with your specific use case
✅ Ask questions about your workflow
✅ Get setup assistance if you're ready

Meeting Details:
📅 [Date and Time]
🔗 [Meeting Link]

Need to reschedule? Just click the link in this email.

Looking forward to speaking with you!
- The Creative Job Hub Team"
```

#### Step 6: Get Embed Code
1. Click **"Get embed code"**
2. Choose **"Inline embed"** for contact page
3. Copy the code (looks like this):

```html
<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    region: "na1",
    portalId: "YOUR_PORTAL_ID",
    formId: "YOUR_MEETING_FORM_ID",
    target: "#hubspot-meeting-widget"
  });
</script>
```

---

### **Calendly Setup (Alternative)**

#### Step 1: Create Account
1. Sign up at [calendly.com](https://calendly.com)
2. Connect your Google/Outlook calendar
3. Set your availability preferences

#### Step 2: Create Event Type
```
Event Name: "Field Service Software Demo"
Duration: 15 minutes
Location: Google Meet (auto-generated)
Description: "Personalized demo of Creative Job Hub field service management software"
```

#### Step 3: Add Qualifying Questions
```
Custom Questions:
- What's your company name?
- How many technicians do you have?
- What industry are you in? (dropdown)
- What's your biggest field service challenge?
- Are you currently using any software?
```

#### Step 4: Customize Notifications
```
Email Reminders:
- 24 hours before: "Demo reminder + preparation tips"
- 1 hour before: "Starting soon! Here's your meeting link"

Follow-up Actions:
- Add to CRM/email list
- Send demo recording link
- Schedule follow-up if interested
```

#### Step 5: Get Embed Code
1. Go to your event settings
2. Click **"Share"** > **"Embed"**
3. Choose **"Inline Embed"**
4. Copy the code:

```html
<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/your-username/demo" 
     style="min-width:320px;height:630px;">
</div>
<script type="text/javascript" 
        src="https://assets.calendly.com/assets/external/widget.js" 
        async>
</script>
<!-- Calendly inline widget end -->
```

---

## 🔧 Implementation

### **Step 1: Add Calendar Widget to Contact Page**

1. Open `/contact.html`
2. Find this comment:
   ```html
   <!-- REPLACE WITH YOUR CALENDAR BOOKING WIDGET -->
   ```
3. Replace the entire comment section with your calendar embed code
4. Remove the temporary demo booking button

### **Step 2: Test the Integration**

1. Visit your contact page
2. Try to book a demo appointment
3. Verify confirmation emails are sent
4. Check that bookings appear in your calendar
5. Test the meeting reminder system

---

## 🎯 Demo Best Practices

### **Pre-Demo Preparation**
```
Research the prospect:
✅ Check their website/industry
✅ Review their form responses
✅ Prepare relevant use cases
✅ Have industry-specific talking points ready
```

### **Demo Structure (15 minutes)**
```
Minutes 1-2: Introduction & Agenda
- Thank them for their time
- Confirm their biggest challenge
- Set expectations for the demo

Minutes 3-10: Tailored Demo
- Show features relevant to their needs
- Use their industry terminology
- Demonstrate specific workflows they mentioned

Minutes 11-14: Q&A & Next Steps
- Answer their questions
- Discuss implementation timeline
- Explain pricing if they're interested

Minute 15: Follow-up
- Send demo recording
- Schedule follow-up if needed
- Offer free trial setup assistance
```

### **Demo Talking Points by Industry**

**HVAC Contractors:**
- Preventive maintenance scheduling
- Service agreement management
- Refrigerant tracking
- Seasonal demand planning

**Plumbing Contractors:**
- Emergency dispatch optimization
- Leak detection workflows
- Pipe inspection scheduling
- Hydro-jetting job management

**Electrical Contractors:**
- Code compliance tracking
- Panel upgrade workflows
- Safety inspection management
- Permit tracking

**Landscaping/Lawn Care:**
- Seasonal service scheduling
- Weather-based routing
- Recurring maintenance contracts
- Crew management

**Handyman Services:**
- Multi-trade project tracking
- Skill-based technician matching
- Customer approval workflows
- Tool and material inventory

---

## 📊 Tracking & Analytics

### **Key Metrics to Monitor**
```
📅 Booking Conversion Rate: 
- Target: 2-5% of contact page visitors
- Track: Page views → Demo bookings

⏱️ Show-up Rate:
- Target: 80%+ attendance
- Track: Bookings → Actual demos

💰 Demo-to-Trial Rate:
- Target: 50%+ start free trial
- Track: Demos → Trial signups

🎯 Demo-to-Customer Rate:
- Target: 20-30% convert to paid
- Track: Demos → Paid customers
```

### **Follow-up Automation Ideas**

**Immediate (Right after booking):**
- Confirmation email with agenda
- Calendar invite with meeting details
- Preparation email with questions to consider

**24 Hours Before:**
- Reminder email with meeting link
- "What to expect" overview
- Contact info for rescheduling

**1 Hour Before:**
- Final reminder with direct meeting link
- Mobile-friendly meeting instructions

**After Demo:**
- Thank you email with demo recording
- Free trial setup link with personal code
- Follow-up meeting scheduler for detailed onboarding

**If No-Show:**
- Automated rescheduling email
- Demo recording with key highlights
- Alternative contact options (phone, email)

---

## 🔗 Integration Options

### **CRM Integration**
- **HubSpot:** Automatic contact creation and deal tracking
- **Salesforce:** Zapier integration for lead management
- **Pipedrive:** Direct calendar sync for sales pipeline

### **Email Marketing Integration**
- **ConvertKit:** Add demo attendees to nurture sequences
- **Mailchimp:** Segment prospects based on demo attendance
- **ActiveCampaign:** Trigger personalized follow-up campaigns

### **Analytics Integration**
- **Google Analytics:** Track demo bookings as conversion events
- **Mixpanel:** Detailed funnel analysis from visit to booking
- **HubSpot Analytics:** Complete visitor-to-customer journey

---

## ✅ Implementation Checklist

### **Setup Phase**
- [ ] Choose calendar platform (HubSpot Meetings recommended)
- [ ] Create demo event with proper duration and buffer
- [ ] Set up availability schedule
- [ ] Configure qualifying questions
- [ ] Customize confirmation emails and reminders
- [ ] Test booking flow end-to-end

### **Integration Phase**
- [ ] Add calendar widget to contact page
- [ ] Update hero section with demo CTA button
- [ ] Test mobile responsiveness
- [ ] Set up analytics tracking
- [ ] Configure CRM integration
- [ ] Create demo follow-up sequences

### **Launch Phase**
- [ ] Train team on demo best practices
- [ ] Create industry-specific demo scripts
- [ ] Set up demo recording system
- [ ] Monitor booking and show-up rates
- [ ] Optimize based on feedback and metrics

---

## 🎥 Demo Recording Setup

### **Recording Platform Options**
- **Loom:** Easy screen recording and sharing
- **Zoom:** Built-in recording for video calls
- **Riverside.fm:** High-quality recording for professional demos

### **Recording Best Practices**
```
Always Record:
✅ Screen share of your demo
✅ Audio commentary explaining features
✅ Industry-specific use cases
✅ Q&A session highlights

Post-Recording:
✅ Edit for clarity (remove dead time)
✅ Add captions for accessibility
✅ Create shareable link with expiration
✅ Include in follow-up email template
```

---

## 💡 Advanced Tips

### **Reduce No-Shows**
- Send 3 reminder emails (24hr, 2hr, 15min before)
- Include mobile-friendly meeting instructions
- Offer easy rescheduling options
- Use calendar blocking to prevent overbooking

### **Improve Conversion**
- Ask qualifying questions to personalize demo
- Research prospect's industry and company
- Show features most relevant to their challenges
- Have pricing and next steps ready

### **Scale Your Demos**
- Create pre-recorded demo for common industries
- Use demo recording for follow-up nurturing
- Build demo request into exit-intent popup
- Add demo CTA to high-traffic pages

### **Measure Success**
- Track booking source (homepage, contact page, etc.)
- Monitor conversion rates by traffic source
- A/B test demo CTA button text and placement
- Survey attendees for feedback and improvements

---

Ready to get started? Choose your platform and follow the setup instructions above! The contact page is already prepared with placeholder code for your calendar widget.