const socket = io();

const form = document.getElementById("concierge-form");
const input = document.getElementById("concierge-input");
const chatLog = document.getElementById("chat-log");

function addMessage(text, sender) {
  const div = document.createElement("div");

  div.className =
    sender === "user"
      ? "chat-bubble user"
      : "chat-bubble bot";

  div.textContent = text;

  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  socket.emit("conciergeMessage", {
    message
  });

  input.value = "";
});

socket.on("conciergeReply", (data) => {
  addMessage(data.text, "bot");
});