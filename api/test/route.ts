export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    // Test 1: Check environment variables
    const groqKey = process.env.GROQ_API_KEY
    const etherscanKey = process.env.ETHERSCAN_API_KEY

    const response = {
      message: "API route is working!",
      address: address,
      environment: {
        groqKey: groqKey ? "✅ Found" : "❌ Missing",
        etherscanKey: etherscanKey ? "✅ Found" : "❌ Missing",
      },
      timestamp: new Date().toISOString(),
    }

    // Test 2: Try Etherscan if key exists
    if (etherscanKey && address) {
      try {
        const etherscanUrl = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${etherscanKey}`
        const etherscanResponse = await fetch(etherscanUrl)
        const etherscanData = await etherscanResponse.json()

        response.etherscan = {
          status: etherscanData.status,
          message: etherscanData.message || "Success",
          contractName: etherscanData.result?.[0]?.ContractName || "Unknown",
        }
      } catch (error) {
        response.etherscan = {
          error: "Failed to fetch from Etherscan",
        }
      }
    }

    // Test 3: Try Groq if key exists
    if (groqKey) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            messages: [{ role: "user", content: "Say 'Hello from Groq!'" }],
            max_tokens: 50,
          }),
        })

        if (groqResponse.ok) {
          const groqData = await groqResponse.json()
          response.groq = {
            status: "✅ Working",
            message: groqData.choices[0].message.content,
          }
        } else {
          response.groq = {
            status: "❌ Error",
            error: groqResponse.status,
          }
        }
      } catch (error) {
        response.groq = {
          status: "❌ Failed",
          error: "Network error",
        }
      }
    }

    return Response.json(response)
  } catch (error) {
    return Response.json(
      {
        error: "API route failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
