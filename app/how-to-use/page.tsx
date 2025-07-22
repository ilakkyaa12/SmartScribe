"use client"

import { useState } from "react"
import Link from "next/link"

export default function HowToUsePage() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "Choose Your Input Method",
      icon: "🎯",
      description: "Select how you want to analyze a smart contract",
      details: [
        "Contract Address: Enter a verified contract address from Etherscan",
        "Solidity Code: Paste the smart contract source code directly",
        "Both methods provide comprehensive analysis",
      ],
      tips: "💡 Contract addresses must be verified on Etherscan for analysis",
    },
    {
      title: "Enter Contract Information",
      icon: "📝",
      description: "Provide the contract address or paste Solidity code",
      details: [
        "For addresses: Use format 0x... (42 characters)",
        "For code: Paste complete Solidity contract code",
        "Use our demo contracts to try the system",
      ],
      tips: "💡 Try our example contracts first to see how it works",
    },
    {
      title: "AI Analysis Process",
      icon: "🤖",
      description: "Our AI analyzes the contract for security and functionality",
      details: [
        "Pattern recognition identifies contract types (ERC20, NFT, etc.)",
        "Risk assessment scans for common vulnerabilities",
        "AI generates human-readable explanations",
      ],
      tips: "💡 Analysis typically takes 10-30 seconds depending on contract size",
    },
    {
      title: "Review Results",
      icon: "📊",
      description: "Get comprehensive analysis results and risk assessment",
      details: [
        "Risk Score: 1-10 scale with detailed breakdown",
        "Pattern Detection: Automatic contract type identification",
        "AI Summary: Plain English explanation of contract functionality",
      ],
      tips: "💡 Higher risk scores indicate more potential security concerns",
    },
    {
      title: "Interactive Features",
      icon: "💬",
      description: "Use advanced features for deeper understanding",
      details: [
        "AI Chat: Ask specific questions about the contract",
        "Voice Features: Listen to summaries or ask questions by voice",
        "PDF Reports: Download detailed analysis reports",
      ],
      tips: "💡 Use the chat feature to ask about specific functions or risks",
    },
  ]

  const faqs = [
    {
      question: "What types of contracts can SmartScribe analyze?",
      answer:
        "SmartScribe can analyze any Ethereum smart contract that is verified on Etherscan, including ERC20 tokens, NFTs (ERC721), DeFi protocols, DAOs, and custom contracts. You can also analyze unverified contracts by pasting the Solidity source code directly.",
    },
    {
      question: "How reliable is the risk assessment?",
      answer:
        "SmartScribe uses advanced AI models to detect common smart contract vulnerabilities and patterns. The system analyzes code for known security issues, centralization risks, and suspicious patterns. As a hackathon project, we recommend using it as an educational tool alongside other security practices.",
    },
    {
      question: "Is my contract data stored or shared?",
      answer:
        "No, SmartScribe does not store contract addresses or source code. All analysis is performed in real-time and results are not saved on our servers. Your privacy and security are our top priorities.",
    },
    {
      question: "Can I analyze contracts on other blockchains?",
      answer:
        "Currently, SmartScribe focuses on Ethereum mainnet contracts. Support for other EVM-compatible chains (Polygon, BSC, Arbitrum) is planned for future releases.",
    },
    {
      question: "What should I do if a contract shows high risk?",
      answer:
        "High-risk contracts should be approached with extreme caution. Review the specific risk factors identified, consider the contract's purpose, and never invest more than you can afford to lose. When in doubt, consult with blockchain security experts.",
    },
    {
      question: "How often is the AI model updated?",
      answer:
        "Our AI models are continuously updated with the latest security patterns and vulnerability databases. We incorporate new threat intelligence and improve accuracy based on community feedback and emerging security research.",
    },
  ]

  const riskLevels = [
    {
      level: "Low Risk (1-3)",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "✅",
      description: "Generally safe contracts with standard patterns",
      examples: ["Standard ERC20 tokens", "Simple NFT contracts", "Basic multisig wallets"],
    },
    {
      level: "Medium Risk (4-6)",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: "⚠️",
      description: "Contracts with some centralization or complexity",
      examples: ["Upgradeable contracts", "Contracts with owner privileges", "Complex DeFi protocols"],
    },
    {
      level: "High Risk (7-10)",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: "❌",
      description: "Contracts with significant security concerns",
      examples: ["Contracts with selfdestruct", "Unprotected admin functions", "Suspicious patterns"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📖 How to Use SmartScribe</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to analyze smart contracts and protect yourself from potential risks with our AI-powered security
            analysis tool.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Step-by-Step Guide</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Steps Navigation */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    activeStep === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{step.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Step Details */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{steps[activeStep].icon}</span>
                <h3 className="text-xl font-bold text-gray-900">{steps[activeStep].title}</h3>
              </div>

              <p className="text-gray-600 mb-4">{steps[activeStep].description}</p>

              <ul className="space-y-2 mb-4">
                {steps[activeStep].details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">{steps[activeStep].tips}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Level Guide */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Understanding Risk Levels</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {riskLevels.map((risk, index) => (
              <div key={index} className={`p-6 rounded-lg border-2 ${risk.color}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{risk.icon}</span>
                  <h3 className="font-bold text-lg">{risk.level}</h3>
                </div>

                <p className="mb-4">{risk.description}</p>

                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {risk.examples.map((example, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span>•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">🚀 Pro Tips for Smart Contract Analysis</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">✅ Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li>• Always analyze contracts before interacting</li>
                <li>• Check multiple sources for contract verification</li>
                <li>• Start with small amounts for testing</li>
                <li>• Use the AI chat for specific questions</li>
                <li>• Save analysis reports for future reference</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">⚠️ Red Flags to Watch</h3>
              <ul className="space-y-2 text-sm">
                <li>• High risk scores (7-10)</li>
                <li>• Unverified contracts</li>
                <li>• Excessive owner privileges</li>
                <li>• Unusual or suspicious patterns</li>
                <li>• Missing or incomplete documentation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Analyzing?</h2>
          <p className="text-gray-600 mb-6">Put your knowledge to practice and analyze your first smart contract</p>
          <Link
            href="/analyze"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
          >
            🔍 Start Analyzing Now
          </Link>
        </div>
      </div>
    </div>
  )
}
