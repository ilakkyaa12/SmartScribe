# 🔍 SmartScribe - Multi-Page Web Application

AI-Powered Smart Contract Analyzer with comprehensive multi-page interface and interactive features.

## 📄 Project Summary  
[Project Summary](https://drive.google.com/file/d/1tQvxPmFP_b-w2Soy--xnnuxl9kE979xn/view?usp=sharing)


## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- Git installed

### 1. Clone & Setup
\`\`\`bash
git clone <your-repo>
cd smartscribe-multipage
npm install
\`\`\`

### 2. Environment Setup
Create `.env.local` file:
\`\`\`
GROQ_API_KEY=your_groq_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Run Development
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 to see the application!

### 4. Run Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 Project Structure
\`\`\`
smartscribe-multipage/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page
│   ├── analyze/
│   │   └── page.tsx           # Analysis page
│   ├── how-to-use/
│   │   └── page.tsx           # Instructions page
│   ├── examples/
│   │   └── page.tsx           # Examples page
│   ├── about/
│   │   └── page.tsx           # About page
│   ├── api/
│   │   ├── summary/route.js    # Contract analysis API
│   │   ├── ask/route.js        # AI chat API
│   │   └── test/route.js       # Testing API
│   └── globals.css             # Global styles
├── components/
│   ├── navigation.tsx          # Navigation component
│   └── ui/                     # UI components
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── README.md                   # This file
\`\`\`

## 🌟 Features

### Multi-Page Application
- **Home Page**: Landing page with hero section, features, and stats
- **Analyze Page**: Main contract analysis interface
- **How to Use**: Step-by-step guide and FAQ
- **Examples**: Real contract examples with learning points
- **About**: Mission, technology, and team information

### Core Functionality
- ✅ AI-powered smart contract analysis
- ✅ Risk assessment and scoring (1-10 scale)
- ✅ Pattern recognition (ERC20, NFT, DeFi, etc.)
- ✅ Interactive AI chat Q&A
- ✅ Voice features (speech synthesis & recognition)
- ✅ PDF report generation

### Interactive Features
- 🎤 Voice input for questions
- 🗣️ Text-to-speech for summaries
- 💬 AI-powered chat interface
- 📄 Downloadable PDF reports

### Pages Overview

#### 🏠 Home Page
- Hero section with animated elements
- Feature showcase with rotating highlights
- Statistics and testimonials
- Call-to-action sections

#### 🔍 Analyze Page
- Contract address or code input
- Demo contracts for quick testing
- Real-time analysis results
- Interactive chat interface
- Voice features integration

#### 📖 How to Use Page
- Step-by-step interactive guide
- Risk level explanations
- FAQ section
- Pro tips and best practices

#### 💡 Examples Page
- Real-world contract examples
- Categorized by type (Token, NFT, DeFi, etc.)
- Learning points for each example
- Direct analysis links

#### ℹ️ About Page
- Mission and values
- Technology stack overview
- Development timeline
- Contact information

## 🔧 Local Development

### Running the Application
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Environment Variables
\`\`\`bash
# Required API Keys
GROQ_API_KEY=your_groq_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

\`\`\`

### API Endpoints
- `POST /api/summary` - Analyze smart contracts
- `POST /api/ask` - AI chat Q&A
- `POST /api/test` - Test API connectivity


## 🔑 API Keys Required

1. **Groq API Key**: Get from https://console.groq.com
   - Used for AI-powered contract analysis
   - Required for chat functionality

2. **Etherscan API Key**: Get from https://etherscan.io/apis
   - Used for fetching verified contract source code
   - Required for address-based analysis


## 🛡️ Security Features

- No data storage (privacy-first)
- Real-time analysis only
- Secure API key handling
- Input validation and sanitization

## 🎯 Target Users

- **DeFi Users**: Analyze protocols before investing
- **NFT Collectors**: Verify NFT contract authenticity
- **Developers**: Learn from real contract examples
- **Security Researchers**: Identify vulnerabilities
- **General Users**: Understand smart contract risks

## 📞 Support

For issues or questions:
1. Visit the “How to Use” page in the app
2. Review example contracts for guidance
3. Ensure API keys are correctly configured
4. Check browser console for error messages
