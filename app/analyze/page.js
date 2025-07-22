"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function SmartScribe() {
  const [contractAddress, setContractAddress] = useState("")
  const [solidityCode, setSolidityCode] = useState("")
  const [inputMethod, setInputMethod] = useState("address")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState("")
  const [connectedWallet, setConnectedWallet] = useState("")
  const [networkName, setNetworkName] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  // 🤖 AI Chat Features
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // 🎤 Voice Features
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const synthRef = useRef(null)
  const recognitionRef = useRef(null)

  // 📄 PDF Preview
  const [showPdfPreview, setShowPdfPreview] = useState(false)

  // ✅ Helper function to get pattern colors
  const getPatternColor = (patternType) => {
    const colors = {
      "ERC20 Token": "#10b981",
      "ERC721 NFT": "#06b6d4",
      ERC1155: "#8b5cf6",
      DEX: "#f59e0b",
      Lending: "#10b981",
      Staking: "#8b5cf6",
      Governance: "#ec4899",
      MultiSig: "#6b7280",
      "Upgradeable (Proxy)": "#f59e0b",
      Upgradeable: "#f59e0b",
      Proxy: "#f59e0b",
    }
    return colors[patternType] || "#6b7280"
  }

  // ✅ Function to format AI summary properly
  const formatAISummary = (rawSummary) => {
    if (!rawSummary) return rawSummary

    let formatted = rawSummary
    formatted = formatted.replace(/(What is the contract's purpose\?)/gi, "\n\n## $1\n")
    formatted = formatted.replace(/(Who can interact with it $$functions \+ permissions$$\?)/gi, "\n\n## $1\n")
    formatted = formatted.replace(/(What are the key risks or vulnerabilities\?)/gi, "\n\n## $1\n")
    formatted = formatted.replace(/(Is there any centralized control)/gi, "\n\n## $1")
    formatted = formatted.replace(/`([^`]+$$[^)]*$$)`/g, "$1")
    formatted = formatted.replace(/^###\s*/gm, "## ")
    formatted = formatted.replace(/^##\s*##\s*/gm, "## ")

    return formatted.trim()
  }

  // ✅ All 4 demo contracts with REAL addresses
  const sampleContracts = [
    {
      name: "USDC Token",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      description: "USD Coin stablecoin contract",
      emoji: "💰",
    },
    {
      name: "Wrapped ETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      description: "Wrapped Ethereum token contract",
      emoji: "🔄",
    },
    {
      name: "Uniswap V2 Factory",
      address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      description: "Uniswap decentralized exchange factory",
      emoji: "🦄",
    },
    {
      name: "Compound cDAI",
      address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
      description: "Compound lending protocol token",
      emoji: "🏦",
    },
  ]

  // ✅ Solidity code examples
  const solidityExamples = [
    {
      name: "Simple Token Contract",
      code: `pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "SimpleToken";
    string public symbol = "STK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
}`,
    },
    {
      name: "Dangerous Contract Example",
      code: `pragma solidity ^0.8.0;

contract DangerousContract {
    address public owner;
    mapping(address => uint256) public balances;
    bool public paused = false;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
    
    function emergencyWithdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    function pauseContract() public onlyOwner {
        paused = true;
    }
    
    function selfDestruct() public onlyOwner {
        selfdestruct(payable(owner));
    }
    
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}`,
    },
  ]

  useEffect(() => {
    checkWalletConnection()
    initializeVoiceFeatures()
  }, [])

  // 🎤 Initialize Voice Features
  const initializeVoiceFeatures = () => {
    if (typeof window !== "undefined") {
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
      }

      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setChatInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          setError(`Voice recognition error: ${event.error}`)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }

  // ✅ Voice Input Function
  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported in this browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    setError("")
    setIsListening(true)
    recognitionRef.current.start()
  }

  // ✅ Clean speech summary without # symbols
  const speakSmartSummary = () => {
    if (!analysis) return

    if (synthRef.current) {
      if (isSpeaking) {
        synthRef.current.cancel()
        setIsSpeaking(false)
        return
      }

      const cleanSummary = `
        Contract Analysis Summary:
        This is a ${analysis.contractName} with a risk score of ${analysis.riskScore} out of 10.
        ${analysis.purpose.replace(/[#*]/g, "")}
        Main risks include: ${analysis.risks
          .map((r) => r.description)
          .slice(0, 2)
          .join(", ")}.
        The contract has ${analysis.keyFunctions.length} key functions.
        ${analysis.riskScore >= 7 ? "This contract has high risk factors." : analysis.riskScore >= 4 ? "This contract has medium risk." : "This contract appears to be low risk."}
      `.replace(/[#*]/g, "")

      const utterance = new SpeechSynthesisUtterance(cleanSummary)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    } else {
      setError("Speech synthesis not supported in this browser")
    }
  }

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setConnectedWallet(accounts[0])
          await getNetworkInfo()
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error)
      }
    }
  }

  const getNetworkInfo = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const networks = {
        "0x1": "Ethereum Mainnet",
        "0x89": "Polygon",
        "0xa": "Optimism",
        "0xa4b1": "Arbitrum",
        "0x38": "BSC",
      }
      setNetworkName(networks[chainId] || "Unknown Network")
    } catch (error) {
      console.error("Failed to get network info:", error)
    }
  }

  const connectWallet = async () => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      setConnectedWallet(accounts[0])
      await getNetworkInfo()
    } catch (error) {
      if (error.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect wallet")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setConnectedWallet("")
    setNetworkName("")
  }

  const analyzeContract = async (quickAddress = null) => {
    const addressToUse = quickAddress || contractAddress

    if (inputMethod === "address" && !addressToUse.trim()) {
      setError("Please enter a contract address")
      return
    }
    if (inputMethod === "code" && !solidityCode.trim()) {
      setError("Please enter Solidity code")
      return
    }
    if (inputMethod === "address" && !addressToUse.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError("Please enter a valid Ethereum address")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setAnalysis(null)
    setChatMessages([])

    try {
      const requestBody = {}
      if (inputMethod === "address") {
        requestBody.address = addressToUse.trim()
      } else {
        requestBody.code = solidityCode.trim()
      }

      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed")
      }

      const backendPatterns = result.patterns
        ? result.patterns.map((pattern) => ({
            type: pattern,
            confidence: "high",
            color: getPatternColor(pattern),
          }))
        : []

      const formattedSummary = formatAISummary(result.summary)

      let purpose = result.summary.split(".")[0]
      if (purpose.toLowerCase().includes("what is the contract's purpose?")) {
        const sentences = result.summary.split(".")
        purpose =
          sentences.find((s) => !s.toLowerCase().includes("what is the contract's purpose")) ||
          sentences[1] ||
          sentences[0]
      }
      purpose = purpose.replace(/[#*]/g, "").trim() + "."

      setAnalysis({
        contractName: inputMethod === "address" ? "Verified Contract" : "Custom Contract",
        purpose: purpose,
        summary: formattedSummary,
        riskScore: result.riskScore,
        riskLabel: result.riskLabel,
        risks: result.risks.map((risk) => ({
          level: result.riskScore >= 7 ? "high" : result.riskScore >= 4 ? "medium" : "low",
          description: risk,
          details: `Risk factor identified in contract analysis.`,
        })),
        patterns: backendPatterns,
        keyFunctions: [
          "Contract contains various functions for blockchain operations",
          "Specific function details available in full summary",
          "Review full analysis for complete function breakdown",
        ],
        rawSummary: result.summary,
        rawCode: inputMethod === "code" ? solidityCode.trim() : "",
        contractAddress: inputMethod === "address" ? addressToUse : "",
        note: result.note,
      })
    } catch (error) {
      console.error("Analysis error:", error)
      setError(error.message || "Failed to analyze contract. Please check your connection.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 🤖 AI Chat Handler
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !analysis) return

    const userMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setIsChatLoading(true)
    const currentInput = chatInput
    setChatInput("")

    try {
      const requestBody = {
        question: currentInput,
        code: analysis.rawCode || analysis.rawSummary,
      }

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (response.ok && result.answer) {
        const aiMessage = { role: "assistant", content: result.answer }
        setChatMessages((prev) => [...prev, aiMessage])
      } else {
        const errorMessage = {
          role: "assistant",
          content: `Sorry, I couldn't process your question. ${result.error || "Please try rephrasing your question."}`,
        }
        setChatMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Q&A Error:", error)
      const errorMessage = {
        role: "assistant",
        content: "Connection error. Please try again.",
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  // ✅ PDF Preview
  const PdfPreview = () => {
    if (!analysis || !showPdfPreview) return null

    const downloadPDF = () => {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>SmartScribe Analysis Report</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
            background: #fff;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #3b82f6; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .header h1 { 
            color: #3b82f6; 
            margin: 0; 
            font-size: 32px;
            font-weight: bold;
        }
        .section { 
            margin: 25px 0; 
            padding: 20px;
            border-left: 4px solid #3b82f6;
            background: #f9fafb;
            border-radius: 8px;
        }
        .risk-high { color: #dc2626; background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 10px 0; border-radius: 6px; }
        .risk-medium { color: #d97706; background: #fffbeb; padding: 15px; border-left: 4px solid #d97706; margin: 10px 0; border-radius: 6px; }
        .risk-low { color: #059669; background: #ecfdf5; padding: 15px; border-left: 4px solid #059669; margin: 10px 0; border-radius: 6px; }
        .risk-score { font-size: 28px; font-weight: bold; color: #3b82f6; }
        .pattern-badge {
            display: inline-block;
            padding: 6px 12px;
            margin: 3px;
            border-radius: 20px;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 SmartScribe Analysis Report</h1>
        <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
    
    <div class="section">
        <h2>📄 Contract Overview</h2>
        <p><strong>Contract Name:</strong> ${analysis.contractName}</p>
        <p><strong>Risk Score:</strong> <span class="risk-score">${analysis.riskScore}/10</span></p>
        <p><strong>Purpose:</strong> ${analysis.purpose}</p>
        
        <h3>🧠 Detected Patterns</h3>
        <div>
            ${analysis.patterns
              .map(
                (pattern) =>
                  `<span class="pattern-badge" style="background-color: ${pattern.color}">${pattern.type}</span>`,
              )
              .join(" ")}
        </div>
    </div>
    
    <div class="section">
        <h2>🤖 AI Analysis Summary</h2>
        <p>${analysis.summary.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "</p><p>")}</p>
    </div>
    
    <div class="section">
        <h2>🛡️ Risk Analysis</h2>
        ${analysis.risks
          .map(
            (risk) => `
            <div class="risk-${risk.level}">
                <h4>${risk.level.toUpperCase()}: ${risk.description}</h4>
                <p>${risk.details}</p>
            </div>
        `,
          )
          .join("")}
    </div>
    
    <div class="section">
        <h2>⚙️ Key Functions</h2>
        <ul>
            ${analysis.keyFunctions.map((func) => `<li>${func}</li>`).join("")}
        </ul>
    </div>
</body>
</html>
      `

      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `smartscribe-analysis-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setShowPdfPreview(false)
    }

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="text-center mb-4">
            <h2 className="mb-2 text-gray-700">📄 PDF Report Preview</h2>
            <p className="text-sm text-gray-600">
              This report will be downloaded as an HTML file that you can print or save as PDF
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-blue-500 mb-3">📋 Report Contents:</h3>
            <ul className="pl-5">
              <li>Contract Overview & Risk Score</li>
              <li>AI Analysis Summary</li>
              <li>Risk Analysis Details</li>
              <li>Key Functions List</li>
            </ul>
          </div>

          <div className="flex gap-2 justify-center">
            <button onClick={downloadPDF} className="btn-danger">
              📄 Download Report
            </button>
            <button onClick={() => setShowPdfPreview(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "risk-item high"
      case "medium":
        return "risk-item medium"
      case "low":
        return "risk-item low"
      default:
        return "risk-item"
    }
  }

  const getRiskBadgeColor = (riskScore) => {
    if (riskScore >= 7) return "badge-risk high"
    if (riskScore >= 4) return "badge-risk medium"
    return "badge-risk low"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔍 SmartScribe</h1>
          <p className="text-xl text-gray-600 mb-1">AI-Powered Smart Contract Explainer</p>
          <p className="text-sm text-gray-500">Protecting users through intelligent contract analysis</p>
        </div>

        {/* Feature Status Bar */}
        <div className="feature-status">
          <div className="feature-list">
            <span>🤖 AI Analysis</span>
            <span>🗣️ Smart Speech Summary</span>
            <span>🎤 Voice Input</span>
            <span>🛡️ Risk Detection</span>
            <span>🧠 Pattern Recognition</span>
            <span>💬 AI Chat Q&A</span>
            <span>📄 PDF Reports</span>
          </div>
        </div>

        {/* MetaMask Connection */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🔗</div>
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${connectedWallet ? "bg-green-500" : "bg-gray-500"}`}></div>
                  <span className="font-semibold text-gray-700">
                    {connectedWallet
                      ? `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}`
                      : "Wallet Not Connected (Optional)"}
                  </span>
                </div>
                {networkName && <p className="text-sm text-gray-600 mt-1">{networkName}</p>}
              </div>
            </div>
            <div>
              {!connectedWallet ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className={isConnecting ? "btn-secondary" : "btn-primary"}
                >
                  {isConnecting ? "🔄 Connecting..." : "🔗 Connect MetaMask"}
                </button>
              ) : (
                <button onClick={disconnectWallet} className="btn-secondary">
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Demo Contracts */}
        <div className="card">
          <h3 className="card-title">⚡ Quick Demo Contracts</h3>
          <div className="demo-contracts-grid">
            {sampleContracts.map((contract, index) => (
              <div key={index} className="demo-contract-card">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{contract.emoji}</span>
                    <h4 className="font-bold text-gray-700">{contract.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{contract.description}</p>
                  <p className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded inline-block">
                    {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setContractAddress(contract.address)
                    setError("")
                    setAnalysis(null)
                    setInputMethod("address")
                  }}
                  className="btn-success ml-3"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4 border border-red-200">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Main Analysis Interface */}
        <div className="card">
          <h3 className="card-title">📄 Smart Contract Analysis</h3>

          {/* Input Method Toggle */}
          <div className="mb-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setInputMethod("address")
                  setError("")
                  setAnalysis(null)
                }}
                className={inputMethod === "address" ? "btn-primary" : "btn-secondary"}
              >
                🔗 Contract Address
              </button>
              <button
                onClick={() => {
                  setInputMethod("code")
                  setError("")
                  setAnalysis(null)
                }}
                className={inputMethod === "code" ? "btn-primary" : "btn-secondary"}
              >
                📝 Solidity Code
              </button>
            </div>
          </div>

          {/* Contract Address Input */}
          {inputMethod === "address" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter contract address (0x...)"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="input-field monospace"
              />
            </div>
          )}

          {/* Solidity Code Input */}
          {inputMethod === "code" && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Paste your Solidity code:</span>
                <div className="flex gap-2">
                  {solidityExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setSolidityCode(example.code)}
                      className={`px-3 py-1 text-xs font-semibold rounded text-white ${
                        index === 0 ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Paste your Solidity code here..."
                value={solidityCode}
                onChange={(e) => setSolidityCode(e.target.value)}
                className="textarea-field"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-600">{solidityCode.length} characters</span>
                <button
                  onClick={() => setSolidityCode("")}
                  className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={() => analyzeContract()}
            disabled={isAnalyzing || (inputMethod === "address" ? !contractAddress.trim() : !solidityCode.trim())}
            className={
              isAnalyzing || (inputMethod === "address" ? !contractAddress.trim() : !solidityCode.trim())
                ? "w-full p-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                : "w-full p-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 cursor-pointer"
            }
          >
            {isAnalyzing ? "🔄 Analyzing Contract..." : "🛡️ Analyze Smart Contract"}
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-5">
            {/* Contract Overview */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📄 Contract Overview</h3>
                <div className="flex gap-2 flex-wrap">
                  {/* Pattern Detection Badges */}
                  {analysis.patterns &&
                    analysis.patterns.map((pattern, index) => (
                      <span key={index} className="badge" style={{ backgroundColor: pattern.color }}>
                        {pattern.type}
                      </span>
                    ))}

                  {/* Risk Badge */}
                  <span className={getRiskBadgeColor(analysis.riskScore)}>Risk: {analysis.riskScore}/10</span>

                  {/* Smart Speech Button */}
                  <button
                    onClick={speakSmartSummary}
                    className={`px-3 py-1 text-xs font-semibold rounded text-white ${
                      isSpeaking ? "bg-red-500 hover:bg-red-600" : "bg-cyan-500 hover:bg-cyan-600"
                    }`}
                  >
                    {isSpeaking ? "🔇 Stop" : "🗣️ Speak"}
                  </button>

                  {/* PDF Preview Button */}
                  <button onClick={() => setShowPdfPreview(true)} className="btn-danger text-xs">
                    📄 PDF
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-base font-medium">{analysis.purpose}</p>
                </div>

                {/* Patterns Detected Section */}
                {analysis.patterns && analysis.patterns.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-purple-600 text-lg font-semibold mb-2 flex items-center gap-2">
                      🧠 Patterns Detected:
                    </h4>
                    <div className="patterns-section">
                      <ul className="pattern-list">
                        {analysis.patterns.map((pattern, idx) => (
                          <li key={idx} className="pattern-item">
                            <span className="badge" style={{ backgroundColor: pattern.color }}>
                              {pattern.type}
                            </span>
                            <span className="text-sm text-gray-600">Contract implements {pattern.type} standard</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-gray-700 font-semibold mb-3">AI Analysis Summary</h4>
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <div className="text-sm leading-relaxed text-gray-700">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-gray-800 text-lg font-bold my-4 border-b-2 border-gray-200 pb-1">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-gray-700 text-base font-bold my-3 border-b border-gray-200 pb-1">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => <h3 className="text-gray-600 text-sm font-bold my-3">{children}</h3>,
                          p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="text-gray-800 font-semibold">{children}</strong>,
                          ul: ({ children }) => <ul className="pl-5 my-3 list-disc">{children}</ul>,
                          ol: ({ children }) => <ol className="pl-5 my-3 list-decimal">{children}</ol>,
                          li: ({ children }) => <li className="my-1 leading-relaxed">{children}</li>,
                          code: ({ children }) => (
                            <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono text-gray-800 border">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {analysis.summary}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                {analysis.note && (
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-xs text-yellow-800">ℹ️ {analysis.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">🛡️ Risk Analysis</h3>
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${getRiskBadgeColor(analysis.riskScore)}`}
                  >
                    Risk Score: {analysis.riskScore}/10
                  </span>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-semibold text-white ${
                      analysis.riskScore >= 7
                        ? "bg-red-500"
                        : analysis.riskScore >= 4
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                  >
                    {analysis.riskScore >= 7 ? "HIGH RISK" : analysis.riskScore >= 4 ? "MEDIUM RISK" : "LOW RISK"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className={getRiskColor(risk.level)}>
                    <span className="text-lg">
                      {risk.level === "high" ? "❌" : risk.level === "medium" ? "⚠️" : "✅"}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-black bg-opacity-10 rounded-xl text-xs font-semibold uppercase">
                          {risk.level}
                        </span>
                        <h4 className="font-semibold">{risk.description}</h4>
                      </div>
                      <p className="text-sm opacity-80">{risk.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Functions */}
            <div className="card">
              <h3 className="card-title">⚙️ Key Functions</h3>
              <div className="space-y-3">
                {analysis.keyFunctions.map((func, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 text-gray-600 text-sm leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <span>{children}</span>,
                          strong: ({ children }) => <strong className="text-gray-800 font-semibold">{children}</strong>,
                          code: ({ children }) => (
                            <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                          ),
                        }}
                      >
                        {func}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Q&A Section */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">💬 AI Chat Q&A</h3>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all uppercase tracking-wide ${
                    showChat
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200"
                  }`}
                >
                  {showChat ? (
                    <>
                      <span className="text-base">❌</span>
                      Hide Chat
                    </>
                  ) : (
                    <>
                      <span className="text-base">🤖</span>
                      Ask Questions
                    </>
                  )}
                </button>
              </div>

              {showChat && (
                <div>
                  <div className="chat-container">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-5xl mb-4">🤖</div>
                        <p className="text-gray-600 italic text-base mb-4">Ask me anything about this contract!</p>
                        <div className="mt-4 text-xs text-gray-500 space-y-2">
                          <p className="bg-white p-2 rounded">💡 "What are the main risks?"</p>
                          <p className="bg-white p-2 rounded">💡 "How does the withdraw function work?"</p>
                          <p className="bg-white p-2 rounded">💡 "Is this contract safe to use?"</p>
                        </div>
                      </div>
                    ) : (
                      chatMessages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.role}`}>
                          <div className="font-bold mb-2 text-sm text-gray-700">
                            <strong>{message.role === "user" ? "🧑 You:" : "🤖 SmartScribe AI:"}</strong>
                          </div>
                          {message.role === "user" ? (
                            <div className="text-sm text-gray-800 font-semibold">{message.content}</div>
                          ) : (
                            <div className="text-sm text-gray-700 mt-2">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ children }) => <p className="my-2">{children}</p>,
                                  strong: ({ children }) => (
                                    <strong className="text-gray-800 font-semibold">{children}</strong>
                                  ),
                                  ul: ({ children }) => <ul className="pl-5 my-2 list-disc">{children}</ul>,
                                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                                  code: ({ children }) => (
                                    <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                                      {children}
                                    </code>
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {isChatLoading && (
                      <div className="text-center text-gray-600 py-5">
                        <div className="text-2xl mb-2">🤖</div>
                        <p>AI is thinking...</p>
                        <div className="mt-2">
                          <div className="loading-spinner"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="chat-input-container">
                    <input
                      type="text"
                      placeholder="Ask about this contract..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                      className="chat-input"
                    />

                    {/* Voice Input Button */}
                    <button
                      onClick={startListening}
                      className={`px-4 py-3 rounded-lg font-semibold text-base min-w-12 text-white ${
                        isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                      title="Ask by Voice"
                    >
                      {isListening ? "🔴" : "🎤"}
                    </button>

                    <button
                      onClick={handleChatSubmit}
                      disabled={!chatInput.trim() || isChatLoading}
                      className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${
                        !chatInput.trim() || isChatLoading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isChatLoading ? "..." : "Ask"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10 pt-5 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            SmartScribe • Trusted by developers worldwide • Securing Web3 through intelligent analysis
          </p>
        </div>

        {/* PDF Preview Modal */}
        <PdfPreview />
      </div>
    </div>
  )
}
