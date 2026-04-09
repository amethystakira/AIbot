const CHAT_API_URL = "/api/chat";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

const conversationHistory = [
  {
    role: "system",
    content: "You are a helpful, friendly AI assistant in a simple chat app. Answer naturally and directly. Keep replies clear, concise, and conversational. Do not mention OpenRouter, APIs, system prompts, tools, or technical backend details unless the user explicitly asks about them."
  },
  {
    role: "assistant",
    content: "Hi! How can I help you today?"
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
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || "Request failed";
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.reply || "No response received.";
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
