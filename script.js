const OPENROUTER_API_KEY = "YOUR_API_KEY";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "openrouter/auto";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

const conversationHistory = [
  {
    role: "system",
    content: "You are a helpful AI chatbot. Reply naturally, clearly, and briefly. Do not say you cannot access APIs unless the user specifically asks about external tools."
  },
  {
    role: "assistant",
    content: "Hi! Ask me anything and I will reply using the OpenRouter API."
  }
];

chatForm.addEventListener("submit", handleSendMessage);

async function handleSendMessage(event) {
  event.preventDefault();

  const message = userInput.value.trim();
  if (!message) {
    return;
  }

  addMessageToChat("user", message);
  conversationHistory.push({ role: "user", content: message });

  userInput.value = "";
  setLoadingState(true);
  const typingIndicator = addTypingIndicator();

  try {
    const aiReply = await getAIResponse(conversationHistory);

    removeTypingIndicator(typingIndicator);
    addMessageToChat("assistant", aiReply);
    conversationHistory.push({ role: "assistant", content: aiReply });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    removeTypingIndicator(typingIndicator);
    addMessageToChat(
      "assistant",
      `Error: ${error.message}`
    );
  } finally {
    setLoadingState(false);
    userInput.focus();
  }
}

async function getAIResponse(messages) {
  if (OPENROUTER_API_KEY === "YOUR_API_KEY") {
    throw new Error("Missing API key");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.href,
      "X-Title": "Simple AI Chatbot"
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || "Request failed";
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response received.";
}

function addMessageToChat(role, text) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${role === "user" ? "user-message" : "bot-message"}`;

  const bubbleElement = document.createElement("div");
  bubbleElement.className = "message-bubble";
  bubbleElement.textContent = text;

  messageElement.appendChild(bubbleElement);
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

function addTypingIndicator() {
  const typingElement = document.createElement("div");
  typingElement.className = "message bot-message typing";

  const bubbleElement = document.createElement("div");
  bubbleElement.className = "message-bubble";
  bubbleElement.textContent = "Typing...";

  typingElement.appendChild(bubbleElement);
  chatMessages.appendChild(typingElement);
  scrollToBottom();

  return typingElement;
}

function removeTypingIndicator(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function setLoadingState(isLoading) {
  sendButton.disabled = isLoading;
  userInput.disabled = isLoading;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
