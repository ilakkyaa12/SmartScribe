import { NextResponse } from "next/server"

export async function POST(request) {
  const { question, code } = await request.json()

  if (!question || !code) {
    return NextResponse.json({ error: "Missing question or code." }, { status: 400 })
  }

  const prompt = `You are a smart contract assistant.

Here is a Solidity contract:
${code}

Now answer this question about it in plain English:
Q: ${question}`

  try {
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
    const answer = aiData.choices[0].message.content
    return NextResponse.json({ answer })
  } catch (err) {
    console.error("Q&A error:", err)
    return NextResponse.json({ error: "Failed to answer the question." }, { status: 500 })
  }
}
