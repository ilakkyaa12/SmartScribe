export async function POST(request) {
  try {
    const body = await request.json()
    const address = body.address

    console.log("🔍 Testing SmartScribe with address:", address)

    // Check environment variables
    const groqKey = process.env.GROQ_API_KEY
    const etherscanKey = process.env.ETHERSCAN_API_KEY

    console.log("🔑 Groq Key:", groqKey ? "Found" : "Missing")
    console.log("🔑 Etherscan Key:", etherscanKey ? "Found" : "Missing")

    const response = {
      message: "🎉 SmartScribe API is working!",
      address: address,
      timestamp: new Date().toISOString(),
      environment: {
        groqKey: groqKey ? "✅ Found" : "❌ Missing",
        etherscanKey: etherscanKey ? "✅ Found" : "❌ Missing",
      },
      tests: {},
    }

    // Test 1: Etherscan API
    if (etherscanKey && address) {
      console.log("🌐 Testing Etherscan API...")
      try {
        const etherscanUrl = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${etherscanKey}`
        const etherscanResponse = await fetch(etherscanUrl)
        const etherscanData = await etherscanResponse.json()

        if (etherscanData.status === "1") {
          const contract = etherscanData.result[0]
          response.tests.etherscan = {
            status: "✅ SUCCESS",
            contractName: contract.ContractName || "Unknown",
            isVerified: contract.SourceCode ? "✅ Yes" : "❌ No",
            compiler: contract.CompilerVersion || "Unknown",
            sourceCodeLength: contract.SourceCode ? contract.SourceCode.length : 0,
          }
          console.log("✅ Etherscan API working!")
        } else {
          response.tests.etherscan = {
            status: "❌ FAILED",
            error: etherscanData.message || "Unknown error",
          }
          console.log("❌ Etherscan API failed:", etherscanData.message)
        }
      } catch (error) {
        response.tests.etherscan = {
          status: "❌ ERROR",
          error: "Network error: " + error.message,
        }
        console.log("❌ Etherscan network error:", error.message)
      }
    } else {
      response.tests.etherscan = {
        status: "⏭️ SKIPPED",
        reason: !etherscanKey ? "No API key" : "No address provided",
      }
    }

    // Test 2: Groq AI API - UPDATED MODEL
    if (groqKey) {
      console.log("🤖 Testing Groq AI API...")
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // UPDATED MODEL
            messages: [
              {
                role: "user",
                content: "Say exactly: 'SmartScribe AI is working perfectly! Ready to analyze smart contracts.'",
              },
            ],
            max_tokens: 100,
          }),
        })

        if (groqResponse.ok) {
          const groqData = await groqResponse.json()
          response.tests.groq = {
            status: "✅ SUCCESS",
            model: "llama-3.3-70b-versatile",
            message: groqData.choices[0].message.content,
            usage: groqData.usage || "Not provided",
          }
          console.log("✅ Groq AI API working!")
        } else {
          const errorData = await groqResponse.json()
          response.tests.groq = {
            status: "❌ FAILED",
            error: `HTTP ${groqResponse.status}: ${errorData.error?.message || "Unknown error"}`,
          }
          console.log("❌ Groq API failed:", groqResponse.status)
        }
      } catch (error) {
        response.tests.groq = {
          status: "❌ ERROR",
          error: "Network error: " + error.message,
        }
        console.log("❌ Groq network error:", error.message)
      }
    } else {
      response.tests.groq = {
        status: "⏭️ SKIPPED",
        reason: "No API key provided",
      }
    }

    // Overall status
    const etherscanOk = response.tests.etherscan?.status?.includes("SUCCESS")
    const groqOk = response.tests.groq?.status?.includes("SUCCESS")

    response.overallStatus = {
      ready: etherscanOk && groqOk,
      summary: etherscanOk && groqOk ? "🎉 SmartScribe is fully operational!" : "⚠️ Some components need attention",
    }

    console.log("📊 Test complete. Overall status:", response.overallStatus.summary)

    return Response.json(response)
  } catch (error) {
    console.error("💥 API Error:", error)
    return Response.json(
      {
        error: "❌ API test failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
