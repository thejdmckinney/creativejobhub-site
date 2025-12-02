# 📧 n8n Contact Form Workflow Setup

## Quick Setup Guide

### Step 1: Create the Workflow in n8n

1. Go to: https://creativejobhub.app.n8n.cloud
2. Click **"New Workflow"**
3. Name it: "Contact Form Handler"

### Step 2: Add Webhook Node (Form Receiver)

1. Click the **"+"** button
2. Search for and add **"Webhook"** node
3. Configure it:
   - **HTTP Method**: `POST`
   - **Path**: `contact-form`
   - **Authentication**: `None`
   - **Response Mode**: `On Last Node`
   - **Response Code**: `200`

4. Click **"Listen for Test Event"** or **"Execute Node"**
5. Copy the webhook URL (should be: `https://creativejobhub.app.n8n.cloud/webhook/contact-form`)

### Step 3: Add Email Notification Node

1. Add an **"Email"** node (or **Gmail** node)
2. Configure it:
   - **To Email**: `hello@creativejobhub.com` (or your preferred email)
   - **Subject**: `New Contact Form Submission from {{ $json.name }}`
   - **Email Type**: `HTML`
   - **Message**:
   ```html
   <h2>New Contact Form Submission</h2>
   
   <p><strong>Name:</strong> {{ $json.name }}</p>
   <p><strong>Email:</strong> {{ $json.email }}</p>
   <p><strong>Company:</strong> {{ $json.company }}</p>
   <p><strong>Phone:</strong> {{ $json.phone }}</p>
   <p><strong>Team Size:</strong> {{ $json.team_size }}</p>
   
   <p><strong>Message:</strong><br>
   {{ $json.message }}</p>
   
   <hr>
   
   <p><strong>Tracking Info:</strong></p>
   <p>Page URL: {{ $json.page_url }}</p>
   <p>Referrer: {{ $json.referrer }}</p>
   <p>Timestamp: {{ $json.timestamp }}</p>
   ```

### Step 4: (Optional) Add HubSpot Integration

1. Add **"HubSpot"** node
2. Choose **"Contact" → "Create or Update"**
3. Map fields:
   - **Email**: `{{ $json.email }}`
   - **First Name**: `{{ $json.name.split(' ')[0] }}`
   - **Last Name**: `{{ $json.name.split(' ').slice(1).join(' ') }}`
   - **Company**: `{{ $json.company }}`
   - **Phone**: `{{ $json.phone }}`
   - **Custom Properties**: Add any other fields you want

### Step 5: (Optional) Add Google Sheets Logger

1. Add **"Google Sheets"** node
2. Choose **"Append"**
3. Select your spreadsheet
4. Map columns to form fields

### Step 6: Activate the Workflow

1. Click **"Save"** (top right)
2. Toggle the workflow to **"Active"** (switch at top)

### Step 7: Test It!

1. Go to your contact page: https://creativejobhub.com/contact.html
2. Fill out and submit the form
3. Check:
   - Your email inbox for the notification
   - HubSpot for the new contact
   - Google Sheets for the logged entry

---

## 🎯 Example Complete Workflow

```
[Webhook] → [Email] → [HubSpot] → [Google Sheets]
```

All nodes run in sequence. If one fails, the others still execute.

---

## 🔧 Troubleshooting

### Form shows error message
- Check that the webhook URL in contact.html matches your n8n webhook
- Make sure the workflow is **Active** (not paused)
- Check n8n workflow execution history for errors

### Not receiving emails
- Verify email node credentials are configured
- Check spam folder
- Test the email node directly in n8n

### HubSpot not creating contacts
- Verify HubSpot credentials in n8n
- Check that required fields (email) are being sent
- Look at n8n execution history for specific error messages

---

## 📝 Current Webhook URL

The contact form is currently configured to send to:
```
https://creativejobhub.app.n8n.cloud/webhook/contact-form
```

If you change the path in n8n, update line ~290 in `contact.html`:
```javascript
const n8nWebhookUrl = 'YOUR_NEW_WEBHOOK_URL_HERE';
```

---

## 🚀 Next Steps

1. Set up the basic webhook + email workflow first
2. Test to make sure it works
3. Add HubSpot integration
4. Add Google Sheets logging
5. Add any other integrations you need

Once this is working, you can also apply the same pattern to other forms on your site!
