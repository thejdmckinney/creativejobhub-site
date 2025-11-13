// HubSpot Private App Configuration and Test Utilities
// Use this to configure and test your HubSpot integration

class HubSpotPrivateAppConnector {
    constructor() {
        this.config = this.loadConfiguration();
        this.baseUrl = 'https://api.hubapi.com';
    }

    // Load configuration from localStorage
    loadConfiguration() {
        const saved = localStorage.getItem('hubspot_config');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing HubSpot config:', e);
            }
        }
        return null;
    }

    // Save configuration to localStorage
    saveConfiguration(config) {
        const configData = {
            accessToken: config.accessToken,
            portalId: config.portalId || null,
            configuredAt: new Date().toISOString(),
            // Don't store sensitive data in production - use secure storage
        };
        
        localStorage.setItem('hubspot_config', JSON.stringify(configData));
        this.config = configData;
        return true;
    }

    // Test connection to HubSpot
    async testConnection() {
        if (!this.config || !this.config.accessToken) {
            throw new Error('No HubSpot access token configured');
        }

        const headers = {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
        };

        try {
            // Test with a simple contact count query
            const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts?limit=1`, {
                headers
            });

            if (!response.ok) {
                throw new Error(`HubSpot API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                message: 'Connection successful',
                contactCount: data.total || 0,
                portalId: this.config.portalId
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                error: error
            };
        }
    }

    // Fetch contacts with proper error handling
    async fetchContacts(limit = 100, properties = ['firstname', 'lastname', 'email', 'createdate']) {
        if (!this.config || !this.config.accessToken) {
            throw new Error('HubSpot not configured');
        }

        const headers = {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
        };

        const url = `${this.baseUrl}/crm/v3/objects/contacts?limit=${limit}&properties=${properties.join(',')}`;
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`HubSpot Contacts API error: ${response.status}`);
        }

        return response.json();
    }

    // Fetch deals with proper error handling
    async fetchDeals(limit = 100, properties = ['dealname', 'amount', 'closedate', 'dealstage']) {
        if (!this.config || !this.config.accessToken) {
            throw new Error('HubSpot not configured');
        }

        const headers = {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
        };

        const url = `${this.baseUrl}/crm/v3/objects/deals?limit=${limit}&properties=${properties.join(',')}`;
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`HubSpot Deals API error: ${response.status}`);
        }

        return response.json();
    }

    // Get account info and portal details
    async getAccountInfo() {
        if (!this.config || !this.config.accessToken) {
            throw new Error('HubSpot not configured');
        }

        const headers = {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`${this.baseUrl}/integrations/v1/me`, { headers });
            
            if (!response.ok) {
                throw new Error(`HubSpot Account API error: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.warn('Could not fetch account info:', error);
            return null;
        }
    }

    // Process contacts into lead metrics
    processContactsToLeadMetrics(contacts) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyContacts = contacts.filter(contact => {
            const created = new Date(contact.properties.createdate);
            return created >= thisMonth;
        });

        const qualifiedContacts = contacts.filter(contact => {
            const lifecycle = contact.properties.lifecyclestage;
            return lifecycle === 'marketingqualifiedlead' || lifecycle === 'salesqualifiedlead';
        });

        return {
            monthlyLeads: monthlyContacts.length,
            totalContacts: contacts.length,
            qualifiedLeads: qualifiedContacts.length,
            leadToJobRate: this.calculateLeadToJobRate(contacts),
            costPerLead: this.estimateCostPerLead(monthlyContacts.length),
            leadSources: this.categorizeLeadSources(contacts),
            dataSource: 'hubspot'
        };
    }

    // Process deals into conversion metrics  
    processDealsToConversionMetrics(deals) {
        const closedWonDeals = deals.filter(deal => 
            deal.properties.dealstage === 'closedwon'
        );

        const totalValue = closedWonDeals.reduce((sum, deal) => 
            sum + (parseFloat(deal.properties.amount) || 0), 0
        );

        const conversionRate = deals.length > 0 ? closedWonDeals.length / deals.length : 0;

        return {
            conversionRate,
            totalDeals: deals.length,
            closedWonDeals: closedWonDeals.length,
            totalValue,
            averageDealValue: closedWonDeals.length > 0 ? totalValue / closedWonDeals.length : 0,
            industryAverage: 0.22, // Benchmark
            dataSource: 'hubspot'
        };
    }

    // Helper methods
    calculateLeadToJobRate(contacts) {
        // This would need to be customized based on your specific lifecycle stages
        const customers = contacts.filter(c => c.properties.lifecyclestage === 'customer');
        return contacts.length > 0 ? customers.length / contacts.length : 0;
    }

    estimateCostPerLead(leadCount) {
        // Estimate based on typical marketing spend - customize for your business
        const estimatedMonthlySpend = 6500;
        return leadCount > 0 ? estimatedMonthlySpend / leadCount : 0;
    }

    categorizeLeadSources(contacts) {
        const sources = {};
        contacts.forEach(contact => {
            const source = contact.properties.hs_analytics_source || 'Unknown';
            sources[source] = (sources[source] || 0) + 1;
        });
        return sources;
    }
}

// Utility functions for integration testing
class HubSpotTestUtils {
    static async quickTest() {
        const connector = new HubSpotPrivateAppConnector();
        
        console.log('🧪 Testing HubSpot Connection...');
        
        const testResult = await connector.testConnection();
        
        if (testResult.success) {
            console.log('✅ HubSpot connection successful!');
            console.log(`📊 Total contacts: ${testResult.contactCount}`);
            
            // Test data fetching
            try {
                const contacts = await connector.fetchContacts(5);
                console.log(`👥 Fetched ${contacts.results.length} sample contacts`);
                
                const deals = await connector.fetchDeals(5);
                console.log(`💼 Fetched ${deals.results.length} sample deals`);
                
                return {
                    success: true,
                    contacts: contacts.results.length,
                    deals: deals.results.length
                };
            } catch (error) {
                console.error('❌ Data fetch error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.error('❌ HubSpot connection failed:', testResult.message);
            return testResult;
        }
    }

    static displayConnectionStatus() {
        const connector = new HubSpotPrivateAppConnector();
        const config = connector.config;
        
        if (config && config.accessToken) {
            console.log('✅ HubSpot configured');
            console.log(`📅 Configured: ${new Date(config.configuredAt).toLocaleDateString()}`);
            if (config.portalId) {
                console.log(`🏢 Portal ID: ${config.portalId}`);
            }
        } else {
            console.log('⚠️ HubSpot not configured');
            console.log('👉 Visit /admin/hubspot-setup.html to configure');
        }
        
        return !!config;
    }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.HubSpotPrivateAppConnector = HubSpotPrivateAppConnector;
    window.HubSpotTestUtils = HubSpotTestUtils;
    
    // Display status on load
    console.log('🔧 HubSpot Private App Connector loaded');
    HubSpotTestUtils.displayConnectionStatus();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HubSpotPrivateAppConnector, HubSpotTestUtils };
}