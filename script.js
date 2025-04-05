// ========== TIMER SETTINGS ==========
let focusTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;

let currentTime = focusTime;
let sessionCount = 0;
let isFocus = true;
let interval;
let timerRunning = false;

// ========== GAMIFICATION VALUES ==========
let xp = parseInt(localStorage.getItem("xp")) || 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastActiveDate = localStorage.getItem("lastActiveDate") || "";
let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

// ========== DOM ELEMENTS ==========
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const modeDisplay = document.getElementById("mode");
const sessionDisplay = document.getElementById("sessionCount");
const xpDisplay = document.getElementById("xp");
const levelDisplay = document.getElementById("level");
const coinsDisplay = document.getElementById("coins");
const streakDisplay = document.getElementById("streak");
const achievementsDisplay = document.getElementById("achievements");

// ========== INIT ==========
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}
updateXPAndLevel();
displayAchievements();

// ========== TIMER FUNCTIONS ==========
function updateTimerDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function startTimer() {
  if (timerRunning) return;

  timerRunning = true;
  interval = setInterval(() => {
    currentTime--;
    updateTimerDisplay();

    if (currentTime <= 0) {
      clearInterval(interval);
      timerRunning = false;

      sendNotification();
      playSound();

      if (isFocus) {
        sessionCount++;
        xp += 10;
        coins += 5;
        updateXPAndLevel();
        sessionDisplay.textContent = `Sessions Completed: ${sessionCount}`;
        isFocus = false;

        currentTime = sessionCount % 4 === 0 ? longBreakTime : shortBreakTime;
        modeDisplay.textContent =
          sessionCount % 4 === 0 ? "Long Break" : "Short Break";
      } else {
        isFocus = true;
        currentTime = focusTime;
        modeDisplay.textContent = "Focus";
      }

      updateTimerDisplay();
      startTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  timerRunning = false;
  isFocus = true;
  currentTime = focusTime;
  sessionCount = 0;
  modeDisplay.textContent = "Focus";
  sessionDisplay.textContent = `Sessions Completed: 0`;
  updateTimerDisplay();
}

function setMode(mode) {
  clearInterval(interval);
  timerRunning = false;

  if (mode === "focus") {
    currentTime = focusTime;
    isFocus = true;
    modeDisplay.textContent = "Focus";
  } else if (mode === "short") {
    currentTime = shortBreakTime;
    isFocus = false;
    modeDisplay.textContent = "Short Break";
  } else if (mode === "long") {
    currentTime = longBreakTime;
    isFocus = false;
    modeDisplay.textContent = "Long Break";
  }

  updateTimerDisplay();
}

// ========== GAMIFICATION ==========
function updateXPAndLevel() {
  localStorage.setItem("xp", xp);
  xpDisplay.textContent = `XP: ${xp}`;
  const level = Math.floor(xp / 100) + 1;
  levelDisplay.textContent = `Level: ${level}`;

  localStorage.setItem("coins", coins);
  coinsDisplay.textContent = `Coins: ${coins}`;

  updateStreak();
  checkAchievements();
}

function updateStreak() {
  const today = new Date().toDateString();

  if (lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastActiveDate === yesterday) {
      streak++;
    } else {
      streak = 1;
    }

    lastActiveDate = today;
    localStorage.setItem("lastActiveDate", lastActiveDate);
    localStorage.setItem("streak", streak);
  }

  streakDisplay.textContent = `🔥 Streak: ${streak} day${
    streak > 1 ? "s" : ""
  }`;
}

function checkAchievements() {
  const newAchievements = [];

  if (xp >= 100 && !achievements.includes("Beginner"))
    newAchievements.push("Beginner");
  if (xp >= 500 && !achievements.includes("Focused Learner"))
    newAchievements.push("Focused Learner");
  if (streak >= 7 && !achievements.includes("1 Week Streak"))
    newAchievements.push("1 Week Streak");

  if (newAchievements.length > 0) {
    achievements = [...achievements, ...newAchievements];
    localStorage.setItem("achievements", JSON.stringify(achievements));
    displayAchievements();
  }
}

function displayAchievements() {
  achievementsDisplay.textContent = `🏆 Achievements: ${
    achievements.length ? achievements.join(", ") : "None yet"
  }`;
}

// ========== NOTIFICATION / SOUND ==========
function sendNotification() {
  if (Notification.permission === "granted") {
    new Notification("⏰ Timer Finished!", {
      body: isFocus ? "Time for a break!" : "Back to work!",
      icon: "icon.png",
    });
  }
}

function playSound() {
  const audio = new Audio("alarm.mp3");
  audio.play();
}

// ========== EVENT LISTENERS ==========
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// ========== UI HELPERS ==========
function showTab(tabId) {
  document.getElementById("timerTab").style.display = "none";
  document.getElementById("taskTab").style.display = "none";
  document.getElementById(tabId).style.display = "block";
}

function fadeOutToTasks() {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "tasks.html";
  }, 500);
}

function fadeIn() {
  document.body.classList.remove("fade-out");
  document.body.style.opacity = "1";
}
