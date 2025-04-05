// Music Player Functionality
const audioPlayer = document.getElementById("audioPlayer");
const musicSelect = document.getElementById("musicSelect");

if (musicSelect && audioPlayer) {
  musicSelect.addEventListener("change", () => {
    audioPlayer.src = musicSelect.value;
    audioPlayer.play();
  });
}

// Chatbot Replies
const chatbotReplies = [
  "How is your day going?",
  "Take a deep breath... inhale... exhale...",
  "You're doing great. Just one step at a time.",
  "Try a short walk or stretch for 2 minutes!",
  "Close your eyes and take 5 slow breaths.",
  "Would you like to try a 5-minute breathing session?",
  "Drink some water and relax your shoulders.",
  "It's okay to pause. You're not behind.",
  "Calm down, everything is going to be okay.",
  "Play your favorite calming music for a few minutes.",
  "You're not alone. I'm here with you.",
  "Take rest if your body feels tired.",
  "Give yourself a break. You're human.",
  "You're stronger than you think.",
  "Want to try journaling your thoughts for a few mins?",
  "I'm proud of you for showing up today.",
];

// Chatbot Logic
function sendMessage() {
  const input = document.getElementById("user-input");
  const msg = input.value.trim();
  if (!msg) return;

  const chat = document.getElementById("chat-messages");

  // User message
  const userMsg = document.createElement("div");
  userMsg.className = "chat user";
  userMsg.innerText = msg;
  chat.appendChild(userMsg);

  // Bot response
  const botMsg = document.createElement("div");
  botMsg.className = "chat bot";
  const reply =
    chatbotReplies[Math.floor(Math.random() * chatbotReplies.length)];
  botMsg.innerText = reply;
  chat.appendChild(botMsg);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;
}

// Enable Enter key to send message
document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("user-input");
  const sendBtn = document.querySelector("#chat-window button");

  if (userInput && sendBtn) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendMessage();
    });

    sendBtn.addEventListener("click", sendMessage);
  }
});
