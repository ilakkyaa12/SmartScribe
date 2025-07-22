import { NextResponse } from "next/server"

export async function POST(request) {
  const { address, code } = await request.json()
  let contractCode = ""

  try {
    // Etherscan case
    if (address) {
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(address)
      if (!isValid) {
        return NextResponse.json({ error: "Invalid Ethereum address." }, { status: 400 })
      }

      const etherscanUrl = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
      const response = await fetch(etherscanUrl)
      const data = await response.json()
      contractCode = data.result[0].SourceCode

      if (!contractCode || contractCode.trim() === "") {
        return NextResponse.json({ error: "Contract not verified on Etherscan." }, { status: 404 })
      }
    }
    // Raw code case
    else if (code) {
      if (code.length < 20) {
        return NextResponse.json({ error: "Invalid Solidity code." }, { status: 400 })
      }
      contractCode = code
    } else {
      return NextResponse.json({ error: "Provide a contract address or Solidity code." }, { status: 400 })
    }

    // Clean code
    let cleanedCode = contractCode
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "") // remove comments
      .replace(/\s+/g, " ") // collapse whitespace

    if (cleanedCode.length > 20000) {
      cleanedCode = cleanedCode.slice(0, 20000)
    }

    // Risk analysis
    const risks = []
    let riskScore = 0
    const lowerCode = cleanedCode.toLowerCase()

    if (lowerCode.includes("onlyowner")) {
      risks.push("Uses `onlyOwner` – centralized control detected.")
      riskScore += 2
    }

    if (lowerCode.includes("selfdestruct")) {
      risks.push("Uses `selfdestruct` – contract can be destroyed by owner.")
      if (!lowerCode.includes("timelock") && !lowerCode.includes("multisig")) {
        risks.push("`selfdestruct` is not protected by timelock or multisig.")
        riskScore += 2
      }
      riskScore += 1
    }

    if (lowerCode.includes("delegatecall")) {
      risks.push("Uses `delegatecall` – dynamic execution risk.")
      riskScore += 3
    }

    if (lowerCode.includes("transfer") && !lowerCode.includes("safetransfer")) {
      risks.push("Uses unsafe `transfer()` pattern – may fail under gas limits.")
      riskScore += 1
    }

    if (lowerCode.includes("tx.origin")) {
      risks.push("Uses `tx.origin` – unsafe authentication vulnerability.")
      riskScore += 2
    }

    if (lowerCode.includes("block.timestamp") || lowerCode.includes("now")) {
      risks.push("Uses timestamp logic – may be miner manipulated.")
      riskScore += 1
    }

    if (lowerCode.includes("paused") && !lowerCode.includes("require(!paused)")) {
      risks.push("`paused` flag is unused in critical functions.")
      riskScore += 1
    }

    if (lowerCode.includes("withdraw") && !lowerCode.includes("nonreentrant")) {
      risks.push("No reentrancy guard on withdraw functions.")
      riskScore += 1
    }

    if (lowerCode.includes("changeowner") && !lowerCode.includes("pendingowner")) {
      risks.push("Owner can be changed directly – no 2-step ownership transfer.")
      riskScore += 1
    }

    if (lowerCode.includes("emergencywithdraw") && lowerCode.includes("owner")) {
      risks.push("Emergency withdraw sends all funds to owner – rug-pull vector.")
      riskScore += 2
    }

    if (!lowerCode.includes("event")) {
      risks.push("No events defined – poor transparency and traceability.")
      riskScore += 1
    }

    // Patterns
    const patterns = []
    if (cleanedCode.includes("transfer") && cleanedCode.includes("approve") && cleanedCode.includes("totalsupply")) {
      patterns.push("ERC20 Token")
    }

    if (cleanedCode.includes("tokenuri") && cleanedCode.includes("ownerof")) {
      patterns.push("ERC721 NFT")
    }

    if (cleanedCode.includes("delegatecall")) {
      patterns.push("Upgradeable (Proxy)")
    }

    if (cleanedCode.includes("swapExactTokensForTokens") || cleanedCode.includes("addLiquidity")) {
      patterns.push("DEX")
    }

    // Normalize
    const normalizedRiskScore = Math.min(Math.max(riskScore, 1), 10)
    let riskLabel = "🟢 Low Risk"
    if (normalizedRiskScore >= 7) riskLabel = "🔴 High Risk"
    else if (normalizedRiskScore >= 4) riskLabel = "🟠 Medium Risk"

    // Prompt to Groq
    const prompt = `You are a Solidity smart contract auditor.

Explain the following in markdown format:

## What is the contract's purpose?

## Who can interact with it (functions + permissions)?

## What are the key risks or vulnerabilities?

## Is there any centralized control (e.g., onlyOwner, upgradeable)?

Avoid greetings or filler.

\`\`\`solidity
${cleanedCode}
\`\`\``

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error("Groq API request failed")
    }

    const aiData = await response.json()
    const summary = aiData.choices[0].message.content

    return NextResponse.json({
      summary,
      riskLabel,
      riskScore: normalizedRiskScore,
      maxRiskScore: 10,
      risks,
      patterns,
      note: contractCode.length > 20000 ? "Note: Input was trimmed to fit Groq's free tier limit." : undefined,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: "Something went wrong while analyzing the contract.",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
