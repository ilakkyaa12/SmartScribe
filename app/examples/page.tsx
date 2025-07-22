"use client"

import { useState } from "react"
import Link from "next/link"

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const contractExamples = [
    {
      name: "USDC Token",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      category: "token",
      type: "ERC20 Token",
      riskLevel: "low",
      riskScore: 2,
      description:
        "USD Coin (USDC) is a fully collateralized US dollar stablecoin. It's a standard ERC20 token with additional features for regulatory compliance.",
      keyFeatures: [
        "Standard ERC20 functionality",
        "Blacklist mechanism for compliance",
        "Upgradeable proxy pattern",
        "Multi-signature governance",
      ],
      learningPoints: [
        "How stablecoins maintain their peg",
        "Regulatory compliance in DeFi",
        "Proxy upgrade patterns",
        "Centralized vs decentralized tokens",
      ],
      icon: "💰",
      color: "bg-green-50 border-green-200",
    },
    {
      name: "CryptoPunks",
      address: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
      category: "nft",
      type: "NFT Collection",
      riskLevel: "low",
      riskScore: 3,
      description:
        "One of the first NFT projects on Ethereum. CryptoPunks are 10,000 unique collectible characters with proof of ownership stored on the blockchain.",
      keyFeatures: [
        "Pre-ERC721 NFT implementation",
        "10,000 unique punk characters",
        "Built-in marketplace functions",
        "Historical significance in NFT space",
      ],
      learningPoints: [
        "Early NFT implementations",
        "How NFT ownership works",
        "Built-in marketplace mechanics",
        "Digital scarcity and provenance",
      ],
      icon: "🎨",
      color: "bg-purple-50 border-purple-200",
    },
    {
      name: "Uniswap V2 Factory",
      address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      category: "defi",
      type: "DEX Factory",
      riskLevel: "medium",
      riskScore: 4,
      description:
        "The factory contract for Uniswap V2, responsible for creating new trading pairs and managing the decentralized exchange protocol.",
      keyFeatures: [
        "Creates new trading pairs",
        "Immutable core logic",
        "Fee collection mechanism",
        "Permissionless pair creation",
      ],
      learningPoints: [
        "How DEXs create liquidity pools",
        "Factory pattern in smart contracts",
        "Automated market makers (AMM)",
        "Decentralized exchange mechanics",
      ],
      icon: "🦄",
      color: "bg-blue-50 border-blue-200",
    },
    {
      name: "Compound cDAI",
      address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
      category: "defi",
      type: "Lending Protocol",
      riskLevel: "medium",
      riskScore: 5,
      description:
        "Compound's cDAI token represents DAI deposits in the Compound lending protocol, earning interest over time.",
      keyFeatures: [
        "Interest-bearing token",
        "Automatic compounding",
        "Collateral for borrowing",
        "Governance token integration",
      ],
      learningPoints: [
        "How DeFi lending works",
        "Interest rate models",
        "Collateralization ratios",
        "Yield farming basics",
      ],
      icon: "🏦",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      name: "Tornado Cash",
      address: "0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936",
      category: "privacy",
      type: "Privacy Protocol",
      riskLevel: "high",
      riskScore: 8,
      description:
        "A privacy protocol that uses zero-knowledge proofs to enable private transactions on Ethereum. Note: This contract has regulatory concerns.",
      keyFeatures: [
        "Zero-knowledge proofs",
        "Transaction privacy",
        "Fixed denomination deposits",
        "Merkle tree commitments",
      ],
      learningPoints: [
        "Privacy in blockchain",
        "Zero-knowledge technology",
        "Regulatory compliance issues",
        "Mixing protocols",
      ],
      icon: "🌪️",
      color: "bg-red-50 border-red-200",
    },
    {
      name: "Gnosis Safe",
      address: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
      category: "security",
      type: "Multi-Signature Wallet",
      riskLevel: "low",
      riskScore: 2,
      description:
        "A multi-signature wallet that requires multiple signatures to execute transactions, providing enhanced security for managing digital assets.",
      keyFeatures: ["Multi-signature security", "Customizable thresholds", "Module system", "Transaction batching"],
      learningPoints: [
        "Multi-signature security",
        "Wallet architecture",
        "Access control patterns",
        "Security best practices",
      ],
      icon: "🔐",
      color: "bg-gray-50 border-gray-200",
    },
  ]

  const categories = [
    { id: "all", name: "All Examples", icon: "📋" },
    { id: "token", name: "Tokens", icon: "💰" },
    { id: "nft", name: "NFTs", icon: "🎨" },
    { id: "defi", name: "DeFi", icon: "🏦" },
    { id: "security", name: "Security", icon: "🔐" },
    { id: "privacy", name: "Privacy", icon: "🌪️" },
  ]

  const filteredExamples =
    selectedCategory === "all"
      ? contractExamples
      : contractExamples.filter((example) => example.category === selectedCategory)

  const getRiskColor = (level) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">💡 Smart Contract Examples</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore real-world smart contracts to understand different patterns, risks, and use cases. Each example
            includes detailed analysis and learning points for educational purposes.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Examples Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {filteredExamples.map((example, index) => (
            <div key={index} className={`${example.color} p-6 rounded-lg border-2`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{example.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{example.name}</h3>
                    <p className="text-sm text-gray-600">{example.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(example.riskLevel)}`}>
                    Risk: {example.riskScore}/10
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{example.description}</p>

              {/* Address */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Contract Address:</p>
                <code className="text-xs bg-white px-2 py-1 rounded border font-mono">{example.address}</code>
              </div>

              {/* Key Features */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">🔧 Key Features:</h4>
                <ul className="space-y-1">
                  {example.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learning Points */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">📚 What You'll Learn:</h4>
                <ul className="space-y-1">
                  {example.learningPoints.map((point, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href={`/analyze?address=${example.address}`}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                🔍 Analyze This Contract
              </Link>
            </div>
          ))}
        </div>

        {/* Educational Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📖 Understanding Contract Patterns</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Architecture Patterns</h3>
              <p className="text-sm text-gray-600">
                Learn about proxy patterns, factory contracts, and modular designs that make contracts upgradeable and
                scalable.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Security Patterns</h3>
              <p className="text-sm text-gray-600">
                Understand access controls, multi-signature wallets, and other security mechanisms that protect user
                funds.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation Patterns</h3>
              <p className="text-sm text-gray-600">
                Explore cutting-edge patterns like zero-knowledge proofs, automated market makers, and yield farming.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Analyze Your Own Contracts?</h2>
          <p className="mb-6 opacity-90">
            Use what you've learned to analyze any smart contract and make informed decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🔍 Start Analyzing
            </Link>
            <Link
              href="/how-to-use"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              📖 Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
