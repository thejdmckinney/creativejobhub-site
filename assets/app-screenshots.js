// App screenshots data organized by category
const screenshotCategories = [
    {
        id: 'mobile-scheduling',
        name: 'Mobile Scheduling & Dispatch',
        icon: '📅',
        screenshots: [
            {
                title: "Mobile Schedule View",
                description: "Access your full schedule on the go with an intuitive mobile interface. View appointments, check technician availability, and manage your day from anywhere.",
                image: "/assets/illustrations/Mobile_schedule.png",
                type: "mobile",
                features: ["Calendar View", "Drag & Drop", "Real-time Updates", "Technician Assignment"]
            },
            {
                title: "Mobile Dashboard",
                description: "Complete business overview at your fingertips. Monitor jobs, revenue, team performance, and key metrics from your mobile device.",
                image: "/assets/illustrations/mobile_dashboard.png",
                type: "mobile",
                features: ["KPI Tracking", "Revenue Analytics", "Job Status", "Quick Actions"]
            },
            {
                title: "Schedule Mobile Interface",
                description: "Streamlined schedule management designed for mobile. Quickly reschedule, assign jobs, and update appointments on the fly.",
                image: "/assets/illustrations/schedule-mobile.png",
                type: "mobile",
                features: ["Mobile Optimized", "Touch Controls", "Quick Edit", "Team View"]
            },
            {
                title: "Dashboard Mobile View",
                description: "Business intelligence in your pocket. Track daily operations, pending tasks, and critical alerts from a mobile-friendly dashboard.",
                image: "/assets/illustrations/dashboard-mobile view.png",
                type: "mobile",
                features: ["Daily Overview", "Action Items", "Performance Metrics", "Notifications"]
            }
        ]
    },
    {
        id: 'mobile-jobs',
        name: 'Mobile Job Management',
        icon: '📋',
        screenshots: [
            {
                title: "Mobile Job Sheets",
                description: "Digital job sheets that technicians can access and update in the field. Capture photos, signatures, notes, and completion status instantly.",
                image: "/assets/illustrations/Job-start-stop-timer.png",
                type: "mobile",
                features: ["Digital Forms", "Photo Capture", "E-Signatures", "Offline Mode"]
            },
            {
                title: "Mobile Job Details",
                description: "Complete job information on mobile devices. View customer details, service history, equipment specs, and special instructions.",
                image: "/assets/illustrations/mobile_job_details.png",
                type: "mobile",
                features: ["Customer Info", "Service History", "Job Notes", "Equipment Details"]
            },
            {
                title: "Jobs Mobile View",
                description: "Browse and manage all active jobs from your phone. Filter by status, technician, date, or priority for quick access.",
                image: "/assets/illustrations/jobs-mobile.png",
                type: "mobile",
                features: ["Job List", "Status Filters", "Quick Search", "Priority Sorting"]
            },
            {
                title: "Client Portal Mobile",
                description: "Customer-facing mobile portal where clients can view service history, pay invoices, and request new services.",
                image: "/assets/illustrations/client-portal-mobile.png",
                type: "mobile",
                features: ["Self-Service", "Invoice Payment", "Service Requests", "Mobile Responsive"]
            }
        ]
    },
    {
        id: 'mobile-invoicing',
        name: 'Mobile Invoicing & Payments',
        icon: '💰',
        screenshots: [
            {
                title: "Properties & Invoices",
                description: "View property-specific billing information and invoice history. Track outstanding balances and payment status by location.",
                image: "/assets/illustrations/properties-invoices.png",
                type: "mobile",
                features: ["Property Billing", "Invoice History", "Payment Status", "Balance Tracking"]
            },
            {
                title: "Price Book Mobile",
                description: "Access your complete service catalog and pricing on mobile. Add line items to jobs and generate quotes in the field.",
                image: "/assets/illustrations/price-book-mobile.png",
                type: "mobile",
                features: ["Service Catalog", "Pricing Lookup", "Quick Add", "Custom Items"]
            }
        ]
    },
    {
        id: 'mobile-routing',
        name: 'Mobile Route Optimization',
        icon: '🗺️',
        screenshots: [
            {
                title: "Map Controls Mobile",
                description: "Interactive map controls optimized for mobile touch. View technician locations, job sites, and optimize routes on the go.",
                image: "/assets/illustrations/New-map-view.png",
                type: "mobile",
                features: ["Touch Controls", "Live Tracking", "Route Preview", "Traffic Updates"]
            },
            {
                title: "Route Details",
                description: "Detailed route information including stops, drive times, and turn-by-turn navigation integration.",
                image: "/assets/illustrations/route_details.png",
                type: "mobile",
                features: ["Stop Sequence", "Drive Times", "Navigation", "ETA Updates"]
            },
            {
                title: "Route List View",
                description: "Overview of all active routes with optimization metrics and technician assignments.",
                image: "/assets/illustrations/route_list.png",
                type: "mobile",
                features: ["Route Overview", "Optimization Stats", "Technician View", "Quick Edit"]
            }
        ]
    },
    {
        id: 'mobile-time-tracking',
        name: 'Mobile Time & Attendance',
        icon: '⏱️',
        screenshots: [
            {
                title: "Time & Attendance Mobile",
                description: "Clock in/out from mobile devices with GPS verification. Track hours, breaks, and overtime automatically.",
                image: "/assets/illustrations/time-att-mobile.png",
                type: "mobile",
                features: ["Clock In/Out", "GPS Verification", "Break Tracking", "Overtime Alerts"]
            },
            {
                title: "Time Management Console Mobile",
                description: "Manager view for monitoring team hours, approving timesheets, and tracking labor costs on mobile.",
                image: "/assets/illustrations/time-mang-console-mobile.png",
                type: "mobile",
                features: ["Team Hours", "Timesheet Approval", "Labor Costs", "Schedule vs Actual"]
            }
        ]
    },
    {
        id: 'mobile-marketing',
        name: 'Mobile Marketing & Campaigns',
        icon: '📢',
        screenshots: [
            {
                title: "Mobile Campaigns",
                description: "Create and manage marketing campaigns from your phone. Track engagement, send targeted messages, and monitor ROI.",
                image: "/assets/illustrations/mobile-campaigns.png",
                type: "mobile",
                features: ["Campaign Builder", "Audience Targeting", "Engagement Tracking", "ROI Analytics"]
            }
        ]
    },
    {
        id: 'web-scheduling',
        name: 'Web Scheduling & Calendar',
        icon: '📆',
        screenshots: [
            {
                title: "Drag & Drop Schedule",
                description: "Powerful drag-and-drop scheduling interface for dispatchers. Easily assign, reschedule, and optimize appointments.",
                image: "/assets/illustrations/drag&drop_schedule.png",
                type: "web",
                features: ["Drag & Drop", "Multi-Tech View", "Capacity Planning", "Color Coding"]
            },
            {
                title: "Emergency Dispatch",
                description: "Quick-dispatch interface for handling emergency calls and urgent service requests with priority routing.",
                image: "/assets/illustrations/Emergency_dispatch.png",
                type: "web",
                features: ["Priority Queue", "Auto-Routing", "Availability Check", "Instant Notification"]
            },
            {
                title: "Schedule Overview",
                description: "Comprehensive schedule view showing all technicians, jobs, and capacity in one intuitive interface.",
                image: "/assets/illustrations/schedule.jpeg",
                type: "web",
                features: ["Team Calendar", "Resource Management", "Capacity View", "Conflict Detection"]
            }
        ]
    },
    {
        id: 'web-clients',
        name: 'Web Client & Property Management',
        icon: '👥',
        screenshots: [
            {
                title: "Client Details",
                description: "Complete customer profile with contact information, service history, billing details, and communication logs.",
                image: "/assets/illustrations/client-details.jpeg",
                type: "web",
                features: ["Contact Management", "Service History", "Billing Info", "Communication Log"]
            },
            {
                title: "Property Jobs View",
                description: "Track all jobs associated with a specific property. View service history, recurring schedules, and upcoming appointments.",
                image: "/assets/illustrations/property-jobs.png",
                type: "web",
                features: ["Job History", "Recurring Services", "Upcoming Work", "Property Notes"]
            },
            {
                title: "Property Estimates",
                description: "Manage estimates by property location. Track quote status, follow-ups, and conversion rates.",
                image: "/assets/illustrations/property-estimates.png",
                type: "web",
                features: ["Estimate Tracking", "Quote Status", "Follow-up Reminders", "Win Rate"]
            }
        ]
    },
    {
        id: 'web-invoicing',
        name: 'Web Invoicing & Financials',
        icon: '💵',
        screenshots: [
            {
                title: "Invoices Dashboard",
                description: "Financial overview with invoice tracking, aging reports, and payment status monitoring.",
                image: "/assets/illustrations/invoices.jpeg",
                type: "web",
                features: ["Invoice List", "Aging Report", "Payment Status", "Quick Actions"]
            },
            {
                title: "Estimate Interface",
                description: "Professional estimate builder with itemized pricing, terms, and instant customer delivery.",
                image: "/assets/illustrations/estimate.jpeg",
                type: "web",
                features: ["Line Items", "Custom Pricing", "Terms & Conditions", "Instant Send"]
            },
            {
                title: "Job Details",
                description: "Complete job management interface with billing, scheduling, notes, and status tracking.",
                image: "/assets/illustrations/job-details.jpeg",
                type: "web",
                features: ["Job Info", "Billing Details", "Notes", "Status Updates"]
            }
        ]
    },
    {
        id: 'web-analytics',
        name: 'Web Analytics & Reporting',
        icon: '📊',
        screenshots: [
            {
                title: "Business Analytics",
                description: "Comprehensive business intelligence dashboard with revenue trends, performance metrics, and growth indicators.",
                image: "/assets/illustrations/business-analytics.jpeg",
                type: "web",
                features: ["Revenue Analytics", "Growth Trends", "KPI Dashboard", "Custom Reports"]
            },
            {
                title: "Re-engagement Dashboard",
                description: "Customer retention analytics showing inactive clients, win-back campaigns, and reactivation strategies.",
                image: "/assets/illustrations/re-engagement-dashboard.jpeg",
                type: "web",
                features: ["Inactive Clients", "Win-back Campaigns", "Reactivation Rate", "Lifetime Value"]
            },
            {
                title: "Re-engagement Analytics",
                description: "Detailed analytics on customer engagement patterns and campaign performance for retention efforts.",
                image: "/assets/illustrations/Re-engagement-analytics.jpeg",
                type: "web",
                features: ["Engagement Metrics", "Campaign ROI", "Customer Segments", "Trend Analysis"]
            },
            {
                title: "Marketing Analytics",
                description: "Track marketing campaign performance, lead generation, and customer acquisition costs.",
                image: "/assets/illustrations/marketing.jpeg",
                type: "web",
                features: ["Campaign Tracking", "Lead Analytics", "CAC Metrics", "Attribution"]
            },
            {
                title: "Pay Period Manager",
                description: "Payroll and time tracking analytics. Review labor costs, overtime, and team productivity by pay period.",
                image: "/assets/illustrations/pay-period-manager.jpeg",
                type: "web",
                features: ["Payroll Analytics", "Labor Costs", "Overtime Tracking", "Productivity Metrics"]
            },
            {
                title: "Time Management Console",
                description: "Comprehensive time tracking and labor management system with timesheet approvals and reporting.",
                image: "/assets/illustrations/time-management-console.jpeg",
                type: "web",
                features: ["Timesheet Management", "Approval Workflow", "Labor Reports", "Schedule vs Actual"]
            }
        ]
    },
    {
        id: 'web-routing',
        name: 'Web Route Planning',
        icon: '🛣️',
        screenshots: [
            {
                title: "Create Routes",
                description: "Build optimized routes with drag-and-drop interface. Plan efficient technician schedules and minimize drive time.",
                image: "/assets/illustrations/Create_routes.png",
                type: "web",
                features: ["Route Builder", "Optimization", "Drive Time", "Stop Management"]
            },
            {
                title: "All Routes Dashboard",
                description: "Overview of all daily routes with status tracking, completion rates, and performance metrics.",
                image: "/assets/illustrations/all_routes.png",
                type: "web",
                features: ["Route Overview", "Status Tracking", "Completion Rate", "Performance Stats"]
            },
            {
                title: "Route Settings",
                description: "Configure routing preferences, optimization parameters, and service area definitions.",
                image: "/assets/illustrations/Route_settings.png",
                type: "web",
                features: ["Route Preferences", "Optimization Settings", "Service Areas", "Parameters"]
            },
            {
                title: "Routing Optimizer",
                description: "Advanced AI-powered route optimization that considers traffic, time windows, and technician skills.",
                image: "/assets/illustrations/routing-optimizer.jpeg",
                type: "web",
                features: ["AI Optimization", "Traffic Integration", "Time Windows", "Skill Matching"]
            }
        ]
    },
    {
        id: 'web-portal',
        name: 'Web Customer Portal',
        icon: '🌐',
        screenshots: [
            {
                title: "Customer Portal",
                description: "Self-service portal where customers can book services, pay invoices, and track job status.",
                image: "/assets/illustrations/portal.jpeg",
                type: "web",
                features: ["Online Booking", "Invoice Payment", "Service History", "Status Tracking"]
            },
            {
                title: "Portal Services",
                description: "Service catalog in customer portal with descriptions, pricing, and instant booking.",
                image: "/assets/illustrations/portal-services.png",
                type: "web",
                features: ["Service Catalog", "Pricing Display", "Online Booking", "Service Details"]
            },
            {
                title: "Portal Settings",
                description: "Customer portal customization settings. Brand your portal with logo, colors, and custom content.",
                image: "/assets/illustrations/portal-settings.png",
                type: "web",
                features: ["Branding", "Custom Colors", "Logo Upload", "Content Settings"]
            },
            {
                title: "Loyalty Portal",
                description: "Customer loyalty program interface with points, rewards, and membership benefits.",
                image: "/assets/illustrations/loyalty-portal.png",
                type: "web",
                features: ["Points System", "Rewards Catalog", "Membership Tiers", "Redemption"]
            },
            {
                title: "Tips Portal",
                description: "Educational content portal for customers with maintenance tips, seasonal advice, and service recommendations.",
                image: "/assets/illustrations/tips-portal.png",
                type: "web",
                features: ["Maintenance Tips", "Seasonal Advice", "How-to Guides", "Video Content"]
            },
            {
                title: "Seasonal Advice",
                description: "Seasonal service recommendations and maintenance reminders delivered through customer portal.",
                image: "/assets/illustrations/seasonal-advice.png",
                type: "web",
                features: ["Seasonal Tips", "Service Reminders", "Weather-based", "Proactive Care"]
            }
        ]
    },
    {
        id: 'web-automation',
        name: 'Web Automation & Integrations',
        icon: '⚙️',
        screenshots: [
            {
                title: "Automation Workflows",
                description: "Build custom automation workflows to streamline repetitive tasks and improve efficiency.",
                image: "/assets/illustrations/automations.png",
                type: "web",
                features: ["Workflow Builder", "Triggers", "Actions", "Conditions"]
            },
            {
                title: "Email Automations",
                description: "Automated email campaigns for appointment reminders, follow-ups, and customer communications.",
                image: "/assets/illustrations/email-automations.png",
                type: "web",
                features: ["Email Templates", "Trigger Events", "Scheduling", "Personalization"]
            }
        ]
    },
    {
        id: 'web-specialized',
        name: 'Industry-Specific Features',
        icon: '🔧',
        screenshots: [
            {
                title: "Pool Equipment Tracking",
                description: "Pool service specific features including equipment tracking, chemical inventory, and test results.",
                image: "/assets/illustrations/pool-equipment.png",
                type: "web",
                features: ["Equipment Database", "Chemical Tracking", "Test Results", "Maintenance Log"]
            },
            {
                title: "Pool Features",
                description: "Comprehensive pool service management with route optimization and chemical calculations.",
                image: "/assets/illustrations/pool-feats.png",
                type: "web",
                features: ["Route Planning", "Chemical Calc", "Pool Database", "Service History"]
            },
            {
                title: "Pool Testing",
                description: "Digital water testing interface with automatic chemical dosage recommendations.",
                image: "/assets/illustrations/pool-testing.png",
                type: "web",
                features: ["Water Testing", "Chemical Dosage", "History Tracking", "Compliance"]
            },
            {
                title: "Chemical Calculator",
                description: "Advanced chemical calculation tool for pool professionals with automatic recommendations.",
                image: "/assets/illustrations/chemical-calc.png",
                type: "web",
                features: ["Dosage Calc", "Chemical Balance", "Safety Alerts", "Cost Tracking"]
            }
        ]
    }
];

// Render screenshots by category
function renderScreenshots(filter = 'all') {
    const container = document.getElementById('screenshotsContainer');
    container.innerHTML = '';

    screenshotCategories.forEach(category => {
        // Filter screenshots by type
        const filteredScreenshots = category.screenshots.filter(screenshot => {
            if (filter === 'all') return true;
            return screenshot.type === filter;
        });

        // Only render category if it has screenshots matching filter
        if (filteredScreenshots.length === 0) return;

        // Create category section
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.setAttribute('data-category', category.id);

        // Category header
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <span class="category-icon">${category.icon}</span>
            <h3 class="category-title">${category.name}</h3>
            <span class="category-count">${filteredScreenshots.length}</span>
        `;
        categorySection.appendChild(header);

        // Screenshot grid
        const grid = document.createElement('div');
        grid.className = 'screenshot-grid';

        filteredScreenshots.forEach((screenshot, index) => {
            const card = createScreenshotCard(screenshot, category.id, index);
            grid.appendChild(card);
        });

        categorySection.appendChild(grid);
        container.appendChild(categorySection);
    });
}

// Create screenshot card
function createScreenshotCard(screenshot, categoryId, index) {
    const card = document.createElement('div');
    card.className = 'screenshot-card';
    card.setAttribute('data-type', screenshot.type);
    card.onclick = () => openModal(screenshot, categoryId, index);

    // Determine if mobile screenshot needs phone frame
    const isMobile = screenshot.type === 'mobile';
    
    const imageHTML = isMobile ? `
        <div class="phone-frame">
            <div class="phone-frame-inner">
                <img src="${screenshot.image}" alt="${screenshot.title}" class="screenshot-image" 
                     onerror="this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"320\" height=\"500\" viewBox=\"0 0 320 500\"><rect width=\"320\" height=\"500\" fill=\"%231e293b\"/><text x=\"160\" y=\"250\" text-anchor=\"middle\" fill=\"%233b82f6\" font-size=\"48\">📱</text><text x=\"160\" y=\"300\" text-anchor=\"middle\" fill=\"%238b92a0\" font-size=\"16\">${screenshot.title}</text></svg>`)}'">
            </div>
        </div>
    ` : `
        <img src="${screenshot.image}" alt="${screenshot.title}" class="screenshot-image" 
             onerror="this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"250\" viewBox=\"0 0 400 250\"><rect width=\"400\" height=\"250\" fill=\"%231e293b\"/><text x=\"200\" y=\"125\" text-anchor=\"middle\" fill=\"%233b82f6\" font-size=\"48\">💻</text><text x=\"200\" y=\"175\" text-anchor=\"middle\" fill=\"%238b92a0\" font-size=\"16\">${screenshot.title}</text></svg>`)}'">
    `;

    card.innerHTML = `
        ${imageHTML}
        <div class="screenshot-info">
            <h3 class="screenshot-title">${screenshot.title}</h3>
            <p class="screenshot-description">${screenshot.description}</p>
            <div class="screenshot-features">
                ${screenshot.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
            </div>
        </div>
    `;

    return card;
}

// Open modal with screenshot details
function openModal(screenshot, categoryId, index) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalInfo = document.getElementById('modalInfo');

    modalImage.src = screenshot.image;
    modalImage.alt = screenshot.title;

    modalInfo.innerHTML = `
        <h2 style="color: #3b82f6; margin-bottom: 12px; font-size: 1.8rem;">${screenshot.title}</h2>
        <p style="color: #e4e7eb; margin-bottom: 20px; line-height: 1.6; font-size: 1.05rem;">${screenshot.description}</p>
        <div style="margin-bottom: 16px;">
            <strong style="color: #8b92a0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Key Features:</strong>
        </div>
        <div class="screenshot-features" style="margin-bottom: 20px;">
            ${screenshot.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
        </div>
        <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
            <button class="modal-back-button" onclick="closeModal()">
                ← Back to Gallery
            </button>
            <a href="https://app.creativejobhub.com/auth?mode=signup" class="btn btn-primary" style="text-decoration: none;">
                Start Free Trial →
            </a>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Filter button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderScreenshots('all');

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter screenshots
            const filter = this.getAttribute('data-filter');
            renderScreenshots(filter);

            // Scroll to screenshots
            document.querySelector('.filter-buttons').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // Close modal on background click
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
});
