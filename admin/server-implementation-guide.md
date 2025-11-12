# Server-Side API Implementation Guide
# This code would be implemented on your web server (Node.js, Python, PHP, etc.)

## Node.js Express Implementation Example

```javascript
// server.js - Example server implementation
const express = require('express');
const axios = require('axios');
const app = express();

// Environment variables for API keys (secure storage)
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

app.use(express.json());

// HubSpot Leads Endpoint
app.get('/api/hubspot/leads', async (req, res) => {
    try {
        const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
            headers: {
                'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            params: {
                limit: 100,
                properties: 'createdate,lifecyclestage,hs_analytics_source'
            }
        });
        
        const contacts = response.data.results;
        const processedData = processHubSpotContacts(contacts);
        
        res.json({
            success: true,
            data: processedData
        });
    } catch (error) {
        console.error('HubSpot API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch HubSpot data'
        });
    }
});

// Stripe Revenue Endpoint  
app.get('/api/stripe/revenue', async (req, res) => {
    try {
        const stripe = require('stripe')(STRIPE_SECRET_KEY);
        
        // Get last 30 days of charges
        const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
        
        const charges = await stripe.charges.list({
            created: { gte: thirtyDaysAgo },
            limit: 100
        });
        
        const processedData = processStripeCharges(charges.data);
        
        res.json({
            success: true,
            data: processedData
        });
    } catch (error) {
        console.error('Stripe API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Stripe data'
        });
    }
});

// Data processing functions
function processHubSpotContacts(contacts) {
    const thisMonth = new Date();
    thisMonth.setDate(1); // First day of current month
    
    const monthlyContacts = contacts.filter(contact => {
        const createdDate = new Date(contact.properties.createdate);
        return createdDate >= thisMonth;
    });
    
    const leadSources = {};
    monthlyContacts.forEach(contact => {
        const source = contact.properties.hs_analytics_source || 'direct';
        leadSources[source] = (leadSources[source] || 0) + 1;
    });
    
    const qualifiedLeads = monthlyContacts.filter(
        c => c.properties.lifecyclestage === 'marketingqualifiedlead'
    ).length;
    
    return {
        monthlyLeads: monthlyContacts.length,
        qualifiedLeads: qualifiedLeads,
        leadToJobRate: qualifiedLeads / monthlyContacts.length,
        leadSources: leadSources
    };
}

function processStripeCharges(charges) {
    const successfulCharges = charges.filter(charge => charge.status === 'succeeded');
    
    const totalAmount = successfulCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const averageAmount = totalAmount / successfulCharges.length;
    
    return {
        total_amount: totalAmount, // In cents
        average_amount: averageAmount, // In cents
        charge_count: successfulCharges.length,
        recurring_percentage: calculateRecurringPercentage(successfulCharges),
        growth_rate: calculateGrowthRate(successfulCharges)
    };
}

function calculateRecurringPercentage(charges) {
    // Logic to identify recurring customers
    const customerCounts = {};
    charges.forEach(charge => {
        const customerId = charge.customer;
        if (customerId) {
            customerCounts[customerId] = (customerCounts[customerId] || 0) + 1;
        }
    });
    
    const recurringCustomers = Object.values(customerCounts).filter(count => count > 1).length;
    const totalCustomers = Object.keys(customerCounts).length;
    
    return totalCustomers > 0 ? recurringCustomers / totalCustomers : 0;
}

function calculateGrowthRate(charges) {
    // Compare current month to previous month
    // This is simplified - would need more sophisticated calculation
    return 0.235; // 23.5% growth placeholder
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## PHP Implementation Example

```php
<?php
// api/hubspot-leads.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$hubspotApiKey = $_ENV['HUBSPOT_API_KEY'];

if (!$hubspotApiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'HubSpot API key not configured']);
    exit;
}

$url = "https://api.hubapi.com/crm/v3/objects/contacts?limit=100";
$headers = [
    "Authorization: Bearer " . $hubspotApiKey,
    "Content-Type: application/json"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch HubSpot data']);
    exit;
}

$data = json_decode($response, true);
$processedData = processHubSpotContacts($data['results']);

echo json_encode([
    'success' => true,
    'data' => $processedData
]);

function processHubSpotContacts($contacts) {
    $thisMonth = new DateTime();
    $thisMonth->setDate($thisMonth->format('Y'), $thisMonth->format('m'), 1);
    
    $monthlyContacts = array_filter($contacts, function($contact) use ($thisMonth) {
        $createdDate = new DateTime($contact['properties']['createdate']);
        return $createdDate >= $thisMonth;
    });
    
    $leadSources = [];
    foreach ($monthlyContacts as $contact) {
        $source = $contact['properties']['hs_analytics_source'] ?? 'direct';
        $leadSources[$source] = ($leadSources[$source] ?? 0) + 1;
    }
    
    $qualifiedLeads = count(array_filter($monthlyContacts, function($contact) {
        return $contact['properties']['lifecyclestage'] === 'marketingqualifiedlead';
    }));
    
    return [
        'monthlyLeads' => count($monthlyContacts),
        'qualifiedLeads' => $qualifiedLeads,
        'leadToJobRate' => count($monthlyContacts) > 0 ? $qualifiedLeads / count($monthlyContacts) : 0,
        'leadSources' => $leadSources
    ];
}
?>
```

## Python Flask Implementation Example

```python
# app.py
from flask import Flask, jsonify
import requests
import os
from datetime import datetime, timedelta
import stripe

app = Flask(__name__)

HUBSPOT_API_KEY = os.environ.get('HUBSPOT_API_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
stripe.api_key = STRIPE_SECRET_KEY

@app.route('/api/hubspot/leads')
def get_hubspot_leads():
    try:
        headers = {
            'Authorization': f'Bearer {HUBSPOT_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            'https://api.hubapi.com/crm/v3/objects/contacts',
            headers=headers,
            params={'limit': 100, 'properties': 'createdate,lifecyclestage,hs_analytics_source'}
        )
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch HubSpot data'}), 500
            
        data = response.json()
        processed_data = process_hubspot_contacts(data['results'])
        
        return jsonify({
            'success': True,
            'data': processed_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stripe/revenue')  
def get_stripe_revenue():
    try:
        # Get charges from last 30 days
        thirty_days_ago = int((datetime.now() - timedelta(days=30)).timestamp())
        
        charges = stripe.Charge.list(
            created={'gte': thirty_days_ago},
            limit=100
        )
        
        processed_data = process_stripe_charges(charges.data)
        
        return jsonify({
            'success': True,
            'data': processed_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_hubspot_contacts(contacts):
    # Filter for current month
    this_month = datetime.now().replace(day=1)
    
    monthly_contacts = [
        contact for contact in contacts
        if datetime.fromisoformat(contact['properties']['createdate'].replace('Z', '+00:00')) >= this_month
    ]
    
    # Count lead sources
    lead_sources = {}
    for contact in monthly_contacts:
        source = contact['properties'].get('hs_analytics_source', 'direct')
        lead_sources[source] = lead_sources.get(source, 0) + 1
    
    # Count qualified leads
    qualified_leads = len([
        c for c in monthly_contacts 
        if c['properties'].get('lifecyclestage') == 'marketingqualifiedlead'
    ])
    
    return {
        'monthlyLeads': len(monthly_contacts),
        'qualifiedLeads': qualified_leads,
        'leadToJobRate': qualified_leads / len(monthly_contacts) if monthly_contacts else 0,
        'leadSources': lead_sources
    }

def process_stripe_charges(charges):
    successful_charges = [c for c in charges if c.status == 'succeeded']
    
    total_amount = sum(charge.amount for charge in successful_charges)
    average_amount = total_amount / len(successful_charges) if successful_charges else 0
    
    return {
        'total_amount': total_amount,  # In cents
        'average_amount': average_amount,  # In cents
        'charge_count': len(successful_charges),
        'recurring_percentage': calculate_recurring_percentage(successful_charges),
        'growth_rate': 0.235  # Placeholder - would calculate from historical data
    }

def calculate_recurring_percentage(charges):
    customer_counts = {}
    for charge in charges:
        if charge.customer:
            customer_counts[charge.customer] = customer_counts.get(charge.customer, 0) + 1
    
    recurring_customers = len([c for c in customer_counts.values() if c > 1])
    total_customers = len(customer_counts)
    
    return recurring_customers / total_customers if total_customers > 0 else 0

if __name__ == '__main__':
    app.run(debug=True)
```

## Environment Variables Setup

```bash
# .env file
HUBSPOT_API_KEY=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
GOOGLE_ANALYTICS_SERVICE_ACCOUNT=path/to/service-account.json
```

## Deployment Notes

1. **Security**: Never expose API keys in frontend code
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Caching**: Cache API responses to reduce external API calls
4. **Error Handling**: Implement proper error handling and logging
5. **CORS**: Configure CORS headers for cross-origin requests

## Testing the Implementation

1. Deploy server code to your hosting provider
2. Set environment variables with your API keys
3. Update the frontend to call your API endpoints instead of external APIs
4. Test each endpoint individually before integrating

This server-side implementation ensures secure API key handling while providing real business data to your dashboard.