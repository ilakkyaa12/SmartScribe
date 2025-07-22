"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes smart contracts for security vulnerabilities and risks",
    },
    {
      icon: "🛡️",
      title: "Risk Assessment",
      description: "Comprehensive risk scoring and detailed security analysis",
    },
    {
      icon: "🧠",
      title: "Pattern Recognition",
      description: "Automatically detects contract patterns like ERC20, NFTs, and more",
    },
    {
      icon: "💬",
      title: "Interactive Chat",
      description: "Ask questions about contracts and get instant AI-powered answers",
    },
  ]

  const platformFeatures = [
    { icon: "🚀", label: "Innovative Technology" },
    { icon: "🔍", label: "Real-time Analysis" },
    { icon: "🎯", label: "15+ Risk Patterns" },
    { icon: "🌟", label: "Open Source" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                <span className="text-6xl md:text-8xl">🔍</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartScribe
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                AI-Powered Smart Contract Analyzer
              </p>
              <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                Protect yourself from malicious smart contracts with our advanced AI analysis. Get instant security
                reports, risk assessments, and detailed explanations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/analyze"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                🚀 Start Analyzing
              </Link>
              <Link
                href="/how-to-use"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center gap-2"
              >
                📖 Learn How
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-4xl animate-bounce">⚡</div>
        <div className="absolute top-40 right-20 text-3xl animate-pulse">🛡️</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-1000">🤖</div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SmartScribe?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology meets blockchain security to protect your investments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`text-center p-6 rounded-xl transition-all duration-300 ${
                  currentFeature === index
                    ? "bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Cutting-Edge Web3 Security Platform</h2>
            <p className="text-xl text-blue-100">
              Built with advanced AI technology for comprehensive blockchain analysis
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{feature.icon}</div>
                <div className="text-blue-100 font-medium">{feature.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Secure Your Smart Contracts?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start analyzing smart contracts today and protect yourself from potential risks
          </p>
          <Link
            href="/analyze"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
          >
            🔍 Analyze Now - It's Free!
          </Link>
        </div>
      </section>
    </div>
  )
}
