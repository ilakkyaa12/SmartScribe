export async function POST(request) {
  try {
    const { inputMethod, address, solidityCode } = await request.json()

    console.log("🔍 Analyzing contract with method:", inputMethod)

    let sourceCode = ""
    let contractName = "Unknown Contract"

    if (inputMethod === "address") {
      // Existing address-based analysis
      if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return Response.json({ error: "Invalid contract address" }, { status: 400 })
      }

      // Fetch from Etherscan
      const etherscanUrl = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`

      console.log("📡 Fetching from Etherscan...")
      const etherscanResponse = await fetch(etherscanUrl)
      const etherscanData = await etherscanResponse.json()

      if (etherscanData.status !== "1") {
        return Response.json({ error: "Contract not found or not verified on Etherscan" }, { status: 404 })
      }

      const contract = etherscanData.result[0]

      if (!contract.SourceCode || contract.SourceCode === "") {
        return Response.json(
          { error: "Contract source code not available. Contract may not be verified." },
          { status: 400 },
        )
      }

      contractName = contract.ContractName || "Unknown Contract"
      sourceCode = contract.SourceCode

      // Clean source code
      if (sourceCode.startsWith("{{") && sourceCode.endsWith("}}")) {
        sourceCode = sourceCode.slice(1, -1)
      }
      if (sourceCode.startsWith("{") && sourceCode.endsWith("}")) {
        try {
          const parsed = JSON.parse(sourceCode)
          if (parsed.sources) {
            sourceCode = Object.values(parsed.sources)
              .map((source) => source.content)
              .join("\n\n")
          }
        } catch {
          // Keep original if parsing fails
        }
      }

      console.log("✅ Contract found:", contractName)
    } else if (inputMethod === "code") {
      // Direct Solidity code analysis
      if (!solidityCode || solidityCode.trim() === "") {
        return Response.json({ error: "No Solidity code provided" }, { status: 400 })
      }

      sourceCode = solidityCode.trim()

      // Try to extract contract name from code
      const contractMatch = sourceCode.match(/contract\s+(\w+)/i)
      contractName = contractMatch ? contractMatch[1] : "Custom Contract"

      console.log("✅ Direct code analysis for:", contractName)
    } else {
      return Response.json({ error: "Invalid input method" }, { status: 400 })
    }

    // Step 2: Analyze with Groq AI
    console.log("🤖 Analyzing with AI...")
    const analysis = await analyzeWithGroq(sourceCode, contractName)

    // Step 3: Risk analysis
    console.log("🛡️ Performing risk analysis...")
    const risks = performRiskAnalysis(sourceCode)
    const riskScore = calculateRiskScore(risks)

    console.log("✅ Analysis complete!")

    return Response.json({
      summary: analysis.summary,
      purpose: analysis.purpose,
      keyFunctions: analysis.keyFunctions,
      permissions: analysis.permissions,
      risks: risks,
      contractName: contractName,
      riskScore: riskScore,
      inputMethod: inputMethod,
    })
  } catch (error) {
    console.error("❌ Analysis error:", error)
    return Response.json({ error: error.message || "Analysis failed" }, { status: 500 })
  }
}

async function analyzeWithGroq(sourceCode, contractName) {
  const prompt = `Analyze this smart contract and provide a clear explanation:

Contract: ${contractName}

Provide a JSON response with these exact keys:
{
  "purpose": "Brief 1-2 sentence explanation of what this contract does",
  "summary": "Detailed 3-4 sentence explanation of how it works",
  "keyFunctions": ["Function 1 description", "Function 2 description", "Function 3 description"],
  "permissions": ["Who can do what", "Access controls", "Admin powers"]
}

Contract code (first 4000 chars):
${sourceCode.slice(0, 4000)}

Make it simple and clear for non-technical users.`

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Try to parse JSON
    try {
      return JSON.parse(content)
    } catch {
      // Fallback if JSON parsing fails
      return {
        purpose: `This is a ${contractName} smart contract deployed on Ethereum.`,
        summary: content.slice(0, 300),
        keyFunctions: ["Contract functions require manual review"],
        permissions: ["Permission details not available"],
      }
    }
  } catch (error) {
    console.error("Groq API error:", error)
    // Fallback analysis
    return {
      purpose: `This appears to be a ${contractName} smart contract.`,
      summary:
        "AI analysis temporarily unavailable. This contract contains various functions for blockchain operations.",
      keyFunctions: ["Standard contract functions", "Token operations (if applicable)", "Access control mechanisms"],
      permissions: ["Contract owner permissions", "User interaction capabilities"],
    }
  }
}

function performRiskAnalysis(sourceCode) {
  const risks = []
  const code = sourceCode.toLowerCase()

  // High Risk
  if (code.includes("selfdestruct")) {
    risks.push({
      level: "high",
      description: "Contract Self-Destruction",
      details: "This contract can be permanently destroyed, potentially causing loss of funds.",
    })
  }

  if (code.includes("delegatecall")) {
    risks.push({
      level: "high",
      description: "Delegate Call Usage",
      details: "Uses delegatecall which can be dangerous if not properly secured.",
    })
  }

  // Medium Risk
  if (code.includes("onlyowner") || code.includes("owner")) {
    risks.push({
      level: "medium",
      description: "Centralized Control",
      details: "Contract has owner-only functions that provide significant control.",
    })
  }

  if (code.includes("upgradeable") || code.includes("proxy")) {
    risks.push({
      level: "medium",
      description: "Upgradeable Contract",
      details: "Contract can be upgraded, meaning its code can change after deployment.",
    })
  }

  if (code.includes("pause")) {
    risks.push({
      level: "medium",
      description: "Pausable Functions",
      details: "Contract has pause functionality that can halt operations.",
    })
  }

  // Low Risk
  if (code.includes("transfer") || code.includes("send")) {
    risks.push({
      level: "low",
      description: "Fund Transfers",
      details: "Contract handles cryptocurrency transfers.",
    })
  }

  if (code.includes("approve")) {
    risks.push({
      level: "low",
      description: "Token Approvals",
      details: "Contract manages token approvals and allowances.",
    })
  }

  // Default if no risks found
  if (risks.length === 0) {
    risks.push({
      level: "low",
      description: "Standard Contract",
      details: "No obvious high-risk patterns detected in initial analysis.",
    })
  }

  return risks
}

function calculateRiskScore(risks) {
  let score = 0
  risks.forEach((risk) => {
    switch (risk.level) {
      case "high":
        score += 3
        break
      case "medium":
        score += 2
        break
      case "low":
        score += 1
        break
    }
  })
  return Math.min(score, 10)
}
