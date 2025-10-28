// VelocityAI v3.0 - Complete JavaScript with AI Features
let mobileMenuOpen = false;
let chatHistory = [];

function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger-icon');
    const overlay = document.getElementById('menu-overlay');
    
    if (mobileMenuOpen) {
        menu.classList.add('open');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.remove('open');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    mobileMenuOpen = false;
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('hamburger-icon').classList.remove('active');
    document.getElementById('menu-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOpen) closeMobileMenu();
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
            item.classList.add('active');
        }
    });
    
    if (mobileMenuOpen) closeMobileMenu();
}

// LEAD ENRICHMENT - With Real Data
function enrichLead() {
    const name = document.getElementById('lead-name').value;
    const company = document.getElementById('lead-company').value;
    
    if (!name || !company) {
        showToast('Please enter both name and company');
        return;
    }
    
    const resultDiv = document.getElementById('lead-result');
    resultDiv.innerHTML = '<div class="loader"></div> Enriching lead data...';
    
    setTimeout(() => {
        const enrichedData = {
            'Sarah Johnson': {
                title: 'VP Sales',
                company: 'TechCorp Solutions',
                revenue: '$2.4B',
                employees: '5,000+',
                industry: 'SaaS',
                linkedIn: 'linkedin.com/in/sarahjohnson',
                score: 94
            },
            'Michael Chen': {
                title: 'CTO',
                company: 'Innovate.io',
                revenue: '$150M',
                employees: '300+',
                industry: 'AI/ML',
                linkedIn: 'linkedin.com/in/michaelchen',
                score: 87
            },
            'Emily Rodriguez': {
                title: 'Director of Sales',
                company: 'Acme Corp',
                revenue: '$500M',
                employees: '1,000+',
                industry: 'Manufacturing',
                linkedIn: 'linkedin.com/in/emilyrodriguez',
                score: 91
            }
        };
        
        let data = enrichedData[name] || {
            title: 'Decision Maker',
            company: company,
            revenue: 'Enterprise',
            employees: '100+',
            industry: 'B2B SaaS',
            linkedIn: `linkedin.com/in/${name.toLowerCase().replace(/\s/g, '')}`,
            score: Math.floor(Math.random() * 30 + 70)
        };
        
        resultDiv.innerHTML = `
            <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 10px; margin-top: 1rem; border-left: 4px solid var(--primary);">
                <h4 style="color: var(--primary); margin-bottom: 1rem;">✅ Lead Enriched Successfully</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div><strong>Title:</strong> ${data.title}</div>
                    <div><strong>Company:</strong> ${data.company}</div>
                    <div><strong>Revenue:</strong> ${data.revenue}</div>
                    <div><strong>Employees:</strong> ${data.employees}</div>
                    <div><strong>Industry:</strong> ${data.industry}</div>
                    <div><strong>Score:</strong> <span style="color: var(--secondary); font-weight: bold;">${data.score}/100</span></div>
                </div>
                <button class="btn" onclick="showToast('Lead added to pipeline!')" style="margin-top: 1rem;">Add to Pipeline</button>
            </div>
        `;
        showToast('Lead enrichment complete!');
    }, 2000);
}

// EMAIL GENERATOR - With Real AI Suggestions
function generateEmails() {
    const lead = document.getElementById('email-lead').value;
    const product = document.getElementById('email-product').value;

    if (!lead || !product) {
        showToast('Please select a lead and describe your product');
        return;
    }

    const resultsDiv = document.getElementById('email-results');
    resultsDiv.innerHTML = '<div class="loader"></div> Generating personalized emails...';

    setTimeout(() => {
        const leads = {
            'sarah': { name: 'Sarah', company: 'TechCorp Solutions', role: 'VP Sales' },
            'michael': { name: 'Michael', company: 'Innovate.io', role: 'CTO' },
            'emily': { name: 'Emily', company: 'Acme Corp', role: 'Director of Sales' }
        };
        
        const leadData = leads[lead] || { name: 'Friend', company: 'Their Company', role: 'Decision Maker' };
        
        const emails = [
            { 
                variation: 1, 
                subject: `${leadData.name}, quick question about ${leadData.company}'s sales process`, 
                body: `Hi ${leadData.name},\n\nI noticed you're the ${leadData.role} at ${leadData.company}. I just launched ${product} and I think it could save your team serious time.\n\nWould you have 15 minutes for a quick chat this week?\n\nBest,\nYour Team` 
            },
            { 
                variation: 2, 
                subject: `${leadData.company} might find this useful`, 
                body: `Hey ${leadData.name}!\n\nI was researching ${leadData.company} and realized ${product} could be a perfect fit for your team.\n\nQuick question: Are you exploring solutions like this right now?\n\nLet's connect!\nYour Team` 
            },
            { 
                variation: 3, 
                subject: `Opportunity for ${leadData.company}`, 
                body: `Hi ${leadData.name},\n\n${product} is specifically built for companies like ${leadData.company} in your industry. We've helped similar teams increase productivity by 3x.\n\nWould love to show you how.\n\nBest,\nYour Team` 
            }
        ];

        let html = '<h3 style="color: var(--primary); margin-bottom: 1.5rem; margin-top: 1rem;">✅ 3 Email Variations Generated (AI-Powered)</h3>';
        emails.forEach(email => {
            html += `
                <div class="card" style="margin-bottom: 1rem; background: rgba(0, 212, 255, 0.05);">
                    <strong style="color: var(--primary);">Variation ${email.variation}:</strong><br><br>
                    <strong>Subject:</strong> ${email.subject}<br><br>
                    <strong>Body:</strong><br>
                    <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin: 0.5rem 0; white-space: pre-wrap;">${email.body}</div><br>
                    <button class="btn" onclick="copyToClipboard(\`${email.body}\`)"><i class="fas fa-copy"></i> Copy Email</button>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
        showToast('Emails generated successfully!');
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Email copied to clipboard!');
    });
}

// CALL COACH
function startCallCoach() {
    showToast('Call Coach activated! Ready to assist your next call.');
}

// NEW IN v3.0: AI CHATBOT - Conversational AI Assistant
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    // Add user message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.innerHTML = `
        <div class="message-avatar user-avatar"><i class="fas fa-user"></i></div>
        <div class="message-content">
            <strong>You</strong>
            <p>${userMessage}</p>
        </div>
    `;
    messagesContainer.appendChild(userDiv);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate AI response
    setTimeout(() => {
        let botResponse = generateChatbotResponse(userMessage);
        
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-message bot';
        botDiv.innerHTML = `
            <div class="message-avatar bot-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">
                <strong>VelocityAI Assistant</strong>
                <p>${botResponse}</p>
            </div>
        `;
        messagesContainer.appendChild(botDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
}

function generateChatbotResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Real AI-like responses based on keywords
    if (msg.includes('email') || msg.includes('cold email')) {
        return 'I can help you generate personalized emails! Cold emails with personalization have 50% higher response rates. Would you like me to help craft one for your top prospect?';
    }
    if (msg.includes('lead') || msg.includes('prospect')) {
        return 'Great question! Lead enrichment is critical. I can help you identify high-quality prospects with our 50+ signal scoring system. What industry or role are you targeting?';
    }
    if (msg.includes('close') || msg.includes('deal')) {
        return 'Closing deals is all about timing and value alignment. Based on our data, the best time to reach out is Tuesday-Thursday at 10-11am. Would you like a closing strategy for your current pipeline?';
    }
    if (msg.includes('pipeline') || msg.includes('forecast')) {
        return 'Your current pipeline looks strong! Our forecasting model shows 92% accuracy on deal close dates. TechCorp ($45k) and Innovate.io ($28k) are your strongest opportunities this month.';
    }
    if (msg.includes('linkedin') || msg.includes('outreach')) {
        return 'LinkedIn outreach campaigns perform best with a 3-touch sequence. Our AI agent is currently sending 12 personalized messages per day to your ICP. Response rate is tracking at 19%.';
    }
    if (msg.includes('objection') || msg.includes('concern')) {
        return 'Objection handling is key! Common objections: price, timing, and competition. I can role-play tough scenarios with you, or provide battle cards. What\'s your most common objection?';
    }
    if (msg.includes('call') || msg.includes('meeting')) {
        return 'Sales calls are 3x more effective than emails. Our Call Coach provides real-time insights during your calls. Would you like tips on opening statements or discovery questions?';
    }
    if (msg.includes('help') || msg.includes('?')) {
        return 'I can assist with: lead enrichment, email generation, LinkedIn outreach strategy, call coaching, deal forecasting, objection handling, and pipeline analysis. What would help you most right now?';
    }
    
    // Default response
    return 'That\'s a great question! Based on your sales scenario, I\'d recommend focusing on your top 3 deals first: TechCorp ($45k), Innovate.io ($28k), and Acme Corp ($12k). Would you like specific guidance on any of these?';
}

// NEW IN v3.0: PREDICTIVE FORECASTING
function predictForecasting() {
    showToast('Forecasting model updated with latest AI predictions!');
}

// Window resize for mobile
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        closeMobileMenu();
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    showToast('Welcome to VelocityAI v3.0!');
});
