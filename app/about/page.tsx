"use client"

import Link from "next/link"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "AI Security Engine",
      role: "Core Analysis System",
      description: "Advanced machine learning models trained on thousands of smart contracts",
      icon: "🤖",
      features: ["Pattern Recognition", "Risk Assessment", "Vulnerability Detection"],
    },
    {
      name: "Blockchain Integration",
      role: "Data Collection",
      description: "Real-time integration with Ethereum and other blockchain networks",
      icon: "⛓️",
      features: ["Etherscan API", "Multi-chain Support", "Real-time Updates"],
    },
    {
      name: "User Experience",
      role: "Interface Design",
      description: "Intuitive interface making complex analysis accessible to everyone",
      icon: "🎨",
      features: ["Voice Features", "Interactive Chat", "PDF Reports"],
    },
  ]

  const projectHighlights = [
    { icon: "🏆", label: "Innovation Platform", description: "Advanced blockchain security solution" },
    { icon: "🤖", label: "AI-Powered", description: "Advanced machine learning analysis" },
    { icon: "🔍", label: "Pattern Detection", description: "15+ security risk patterns" },
    { icon: "🌟", label: "Open Source", description: "Educational and accessible" },
  ]

  const features = [
    {
      title: "AI-Powered Analysis",
      description:
        "Our advanced AI models analyze smart contracts for security vulnerabilities, patterns, and risks using machine learning trained on thousands of contracts.",
      icon: "🧠",
      benefits: ["Instant analysis", "High accuracy", "Continuous learning"],
    },
    {
      title: "Risk Assessment",
      description:
        "Comprehensive risk scoring system that evaluates contracts on a 1-10 scale, identifying potential security issues and centralization risks.",
      icon: "⚖️",
      benefits: ["Clear risk scores", "Detailed explanations", "Actionable insights"],
    },
    {
      title: "Pattern Recognition",
      description:
        "Automatically detects contract types and patterns including ERC20 tokens, NFTs, DeFi protocols, and custom implementations.",
      icon: "🔍",
      benefits: ["Automatic detection", "Standard compliance", "Custom patterns"],
    },
    {
      title: "Interactive Features",
      description:
        "Voice synthesis, speech recognition, AI chat, and PDF report generation make contract analysis accessible and comprehensive.",
      icon: "💬",
      benefits: ["Voice interaction", "AI Q&A", "Detailed reports"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SmartScribe</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're on a mission to make blockchain technology safer and more accessible through AI-powered smart contract
            analysis and security assessment.
          </p>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl opacity-90 max-w-4xl mx-auto">
              To democratize smart contract security by providing advanced AI-powered analysis tools that help users
              understand and assess the risks of blockchain applications before they interact with them.
            </p>
          </div>
        </div>

        {/* Project Highlights */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {projectHighlights.map((highlight, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl mb-2">{highlight.icon}</div>
              <div className="text-lg font-bold text-gray-900 mb-1">{highlight.label}</div>
              <div className="text-gray-600 text-sm">{highlight.description}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes SmartScribe Special</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>

                <p className="text-gray-600 mb-4">{feature.description}</p>

                <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Technology Stack</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.description}</p>

                <div className="space-y-2">
                  {member.features.map((feature, idx) => (
                    <div key={idx} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Secure Your Smart Contract Interactions?</h2>
          <p className="text-gray-600 mb-6">
            Experience the future of blockchain security with our AI-powered analysis platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🔍 Start Analyzing
            </Link>
            <Link
              href="/how-to-use"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
            >
              📖 Learn How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
