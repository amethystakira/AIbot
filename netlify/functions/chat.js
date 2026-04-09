exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/auto";
  const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

  if (!OPENROUTER_API_KEY) {
    return jsonResponse(500, { error: "Missing OPENROUTER_API_KEY" });
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse(400, { error: "Messages array is required" });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aibot.netlify.app",
        "X-Title": "Simple AI Chatbot"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: data.error?.message || "OpenRouter request failed"
      });
    }

    return jsonResponse(200, {
      reply: data.choices?.[0]?.message?.content || "No response received."
    });
  } catch (error) {
    return jsonResponse(500, {
      error: error.message || "Something went wrong"
    });
  }
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}
