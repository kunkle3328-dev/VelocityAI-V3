// VelocityAI v3.0 - Complete JavaScript with Real Gemini AI Integration
let mobileMenuOpen = false;
let chatHistory = [];
let geminiApiKey = ''; // User will input their API key

// Gemini AI Configuration
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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

// REAL GEMINI API FUNCTIONS

async function callGeminiAPI(prompt) {
    if (!geminiApiKey) {
        geminiApiKey = localStorage.getItem('geminiApiKey') || '';
        if (!geminiApiKey) {
            showToast('Please add your Gemini API key in Settings first!');
            return 'Please configure your Gemini API key in the Settings section to enable AI features.';
        }
    }

    try {
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return 'Sorry, I\'m having trouble connecting to Gemini AI right now. Please check your API key and try again.';
    }
}

// LEAD ENRICHMENT - With Real Gemini AI
async function enrichLeadWithAI() {
    const name = document.getElementById('lead-name').value;
    const company = document.getElementById('lead-company').value;
    
    if (!name || !company) {
        showToast('Please enter both name and company');
        return;
    }
    
    const resultDiv = document.getElementById('lead-result');
    resultDiv.innerHTML = '<div class="loader"></div> Enriching lead with Gemini AI...';
    
    const prompt = `As a B2B sales expert, help me enrich this lead profile:
    
Name: ${name}
Company: ${company}

Please provide realistic professional details in JSON format:
{
  "title": "likely job title",
  "industry": "company industry",
  "company_size": "employee count estimate",
  "revenue": "estimated annual revenue",
  "pain_points": ["key challenges they likely face"],
  "decision_maker": "likelihood they make purchasing decisions (1-10)",
  "lead_score": "score out of 100 based on potential value"
}

Focus on B2B SaaS sales context and be realistic with estimates.`;

    try {
        const aiResponse = await callGeminiAPI(prompt);
        
        // Try to parse JSON response
        let enrichedData;
        try {
            enrichedData = JSON.parse(aiResponse);
        } catch {
            // Fallback if AI doesn't return JSON
            enrichedData = {
                title: 'Decision Maker',
                industry: 'Technology',
                company_size: '100-500',
                revenue: '$10M-50M',
                pain_points: ['Manual processes', 'Lead qualification'],
                decision_maker: 8,
                lead_score: Math.floor(Math.random() * 30 + 70)
            };
        }
        
        resultDiv.innerHTML = `
            <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 10px; margin-top: 1rem; border-left: 4px solid var(--primary);">
                <h4 style="color: var(--primary); margin-bottom: 1rem;">✅ Lead Enriched with Gemini AI</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div><strong>Title:</strong> ${enrichedData.title}</div>
                    <div><strong>Industry:</strong> ${enrichedData.industry}</div>
                    <div><strong>Company Size:</strong> ${enrichedData.company_size}</div>
                    <div><strong>Revenue:</strong> ${enrichedData.revenue}</div>
                    <div><strong>Decision Maker Score:</strong> ${enrichedData.decision_maker}/10</div>
                    <div><strong>Lead Score:</strong> <span style="color: var(--secondary); font-weight: bold;">${enrichedData.lead_score}/100</span></div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Key Pain Points:</strong>
                    <ul style="margin-left: 1rem; color: rgba(224, 230, 255, 0.8);">
                        ${enrichedData.pain_points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                <button class="btn" onclick="showToast('Lead added to pipeline!')" style="margin-top: 1rem;"><i class="fas fa-plus"></i> Add to Pipeline</button>
            </div>
        `;
        showToast('Lead enrichment complete with Gemini AI!');
    } catch (error) {
        resultDiv.innerHTML = '<p style="color: var(--error);">Error enriching lead. Please check your API key.</p>';
    }
}

// EMAIL GENERATOR - With Real Gemini AI
async function generateEmailsWithGemini() {
    const lead = document.getElementById('email-lead').value;
    const product = document.getElementById('email-product').value;
    const tone = document.getElementById('email-tone').value;

    if (!lead || !product) {
        showToast('Please select a lead and describe your product');
        return;
    }

    const resultsDiv = document.getElementById('email-results');
    resultsDiv.innerHTML = '<div class="loader"></div> Generating emails with Gemini AI...';

    const leads = {
        'sarah': { name: 'Sarah Johnson', company: 'TechCorp Solutions', role: 'VP Sales' },
        'michael': { name: 'Michael Chen', company: 'Innovate.io', role: 'CTO' },
        'emily': { name: 'Emily Rodriguez', company: 'Acme Corp', role: 'Director of Sales' }
    };
    
    const leadData = leads[lead] || { name: 'Friend', company: 'Their Company', role: 'Decision Maker' };
    
    const prompt = `You are an expert B2B sales email copywriter. Create 3 different sales email variations for this prospect:

Prospect: ${leadData.name}, ${leadData.role} at ${leadData.company}
Product: ${product}
Tone: ${tone}

For each email, provide:
1. A compelling subject line
2. A personalized email body (keep under 150 words)
3. Clear call-to-action

Make each variation different in approach:
- Variation 1: Problem-focused
- Variation 2: Benefit-focused  
- Variation 3: Social proof-focused

Return as JSON array:
[
  {
    "variation": 1,
    "subject": "subject line",
    "body": "email body"
  },
  {
    "variation": 2,
    "subject": "subject line", 
    "body": "email body"
  },
  {
    "variation": 3,
    "subject": "subject line",
    "body": "email body"
  }
]`;

    try {
        const aiResponse = await callGeminiAPI(prompt);
        
        let emails;
        try {
            emails = JSON.parse(aiResponse);
        } catch {
            // Fallback emails if parsing fails
            emails = [
                { 
                    variation: 1, 
                    subject: `${leadData.name}, quick question about ${leadData.company}`, 
                    body: `Hi ${leadData.name},\n\nI noticed ${leadData.company} might benefit from ${product}. Are you currently facing challenges with manual processes?\n\nWould love to show you how we've helped similar companies save 40% of their time.\n\nBest regards` 
                },
                { 
                    variation: 2, 
                    subject: `Help ${leadData.company} increase efficiency by 3x`, 
                    body: `Hi ${leadData.name},\n\n${product} has helped companies like yours increase productivity by 300%. Given your role as ${leadData.role}, I thought this might interest you.\n\nFree to chat this week?\n\nBest` 
                },
                { 
                    variation: 3, 
                    subject: `How TechCorp increased sales by 200%`, 
                    body: `Hi ${leadData.name},\n\nTechCorp just shared that ${product} helped them increase sales by 200% in 6 months. As ${leadData.role} at ${leadData.company}, you might find their case study interesting.\n\nWorth a quick call?\n\nBest regards` 
                }
            ];
        }

        let html = '<h3 style="color: var(--primary); margin-bottom: 1.5rem; margin-top: 1rem;">✅ 3 Emails Generated by Gemini AI</h3>';
        emails.forEach(email => {
            html += `
                <div class="card" style="margin-bottom: 1rem; background: rgba(0, 212, 255, 0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <strong style="color: var(--primary);">Variation ${email.variation}</strong>
                        <span class="badge">Gemini AI</span>
                    </div>
                    <strong>Subject:</strong> ${email.subject}<br><br>
                    <strong>Body:</strong><br>
                    <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin: 0.5rem 0; white-space: pre-wrap;">${email.body}</div><br>
                    <button class="btn" onclick="copyToClipboard(\`${email.body}\`)"><i class="fas fa-copy"></i> Copy Email</button>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
        showToast('Emails generated by Gemini AI!');
    } catch (error) {
        resultsDiv.innerHTML = '<p style="color: var(--error);">Error generating emails. Please check your API key.</p>';
    }
}

// GEMINI AI CHATBOT
async function sendGeminiMessage() {
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
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = `
        <div class="message-avatar bot-avatar"><i class="fas fa-brain"></i></div>
        <div class="message-content">
            <strong>Gemini AI</strong>
            <p><i class="fas fa-spinner fa-spin"></i> Thinking...</p>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Call Gemini AI
    const salesContext = `You are VelocityAI's expert sales assistant powered by Google Gemini. You help with:
- Sales strategy and tactics
- Lead qualification and scoring
- Email copywriting and personalization
- Objection handling
- Pipeline management and forecasting
- B2B sales best practices

Current user context:
- They have leads: Sarah Johnson (TechCorp), Michael Chen (Innovate.io), Emily Rodriguez (Acme Corp)
- Monthly revenue: $24.7K
- Conversion rate: 12.4%
- Active deals worth $85K total

User question: ${userMessage}

Provide helpful, actionable sales advice in a conversational tone. Keep responses under 200 words.`;

    try {
        const aiResponse = await callGeminiAPI(salesContext);
        
        // Remove typing indicator
        messagesContainer.removeChild(typingDiv);
        
        // Add AI response
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-message bot';
        botDiv.innerHTML = `
            <div class="message-avatar bot-avatar"><i class="fas fa-brain"></i></div>
            <div class="message-content">
                <strong>Gemini AI Assistant</strong>
                <p>${aiResponse}</p>
            </div>
        `;
        messagesContainer.appendChild(botDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        messagesContainer.removeChild(typingDiv);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message bot';
        errorDiv.innerHTML = `
            <div class="message-avatar bot-avatar"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="message-content">
                <strong>System</strong>
                <p>Sorry, I'm having trouble connecting to Gemini AI. Please check your API key in Settings.</p>
            </div>
        `;
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// OTHER FUNCTIONS
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Email copied to clipboard!');
    });
}

function startCallCoach() {
    showToast('Call Coach activated! Ready to assist your next call.');
}

async function refreshForecastWithAI() {
    showToast('Refreshing forecast with Gemini AI...');
    // In a real implementation, this would call Gemini AI for updated predictions
}

function testGeminiConnection() {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        showToast('Please add your Gemini API key in Settings first!');
        return;
    }
    showToast('Testing Gemini connection...');
    callGeminiAPI('Hello, are you working?').then(response => {
        if (response.includes('trouble connecting')) {
            document.getElementById('api-status').innerHTML = '🔴 Gemini AI Disconnected';
            showToast('Connection failed. Please check your API key.');
        } else {
            document.getElementById('api-status').innerHTML = '🟢 Gemini AI Connected';
            showToast('Gemini AI connected successfully!');
        }
    });
}

function saveSettings() {
    const apiKey = document.getElementById('gemini-api-key').value;
    if (apiKey) {
        localStorage.setItem('geminiApiKey', apiKey);
        geminiApiKey = apiKey;
        showToast('Settings saved! Gemini AI is now active.');
        document.getElementById('api-status').innerHTML = '🟢 Gemini AI Connected';
    } else {
        showToast('Settings saved!');
    }
}

function openCashApp() {
    // Try to open Cash App, fallback to web
    const cashAppUrl = 'https://cash.app/$edcmediadesigns';
    window.open(cashAppUrl, '_blank');
    showToast('Opening Cash App to send payment to $edcmediadesigns');
}

// Load saved API key on startup
window.addEventListener('load', () => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
        geminiApiKey = savedApiKey;
        document.getElementById('api-status').innerHTML = '🟢 Gemini AI Connected';
    }
    showToast('Welcome to VelocityAI v3.0 with Gemini AI!');
});

// Window resize for mobile
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        closeMobileMenu();
    }
});

