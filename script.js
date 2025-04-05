let timer;
let timeLeft = 1500;
let mode = "focus";
let sessionCount = 0;

const display = document.getElementById("timer-display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const sessionCounter = document.getElementById("sessionCount");

const settingsModal = document.getElementById("settings-modal");
const settingsBtn = document.getElementById("settings-btn");
const closeBtn = document.querySelector(".close-btn");
const saveSettingsBtn = document.getElementById("save-settings");

let durations = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function setMode(newMode) {
  mode = newMode;
  timeLeft = durations[mode];
  updateDisplay();
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  clearInterval(timer);
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      sessionCount++;
      sessionCounter.textContent = `Sessions Completed: ${sessionCount}`;
    }
  }, 1000);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
}

function pauseTimer() {
  clearInterval(timer);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = durations[mode];
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
}

function showTab(tabId) {
  document.getElementById("timerTab").style.display =
    tabId === "timerTab" ? "block" : "none";
  document.getElementById("taskTab").style.display =
    tabId === "taskTab" ? "block" : "none";
}

// Settings Modal Events
settingsBtn.onclick = () => (settingsModal.style.display = "block");
closeBtn.onclick = () => (settingsModal.style.display = "none");
window.onclick = (e) => {
  if (e.target == settingsModal) settingsModal.style.display = "none";
};

saveSettingsBtn.onclick = () => {
  const focus = parseInt(document.getElementById("focus-duration").value);
  const short = parseInt(document.getElementById("short-break-duration").value);
  const long = parseInt(document.getElementById("long-break-duration").value);

  if (focus > 0 && short > 0 && long > 0) {
    durations.focus = focus * 60;
    durations.shortBreak = short * 60;
    durations.longBreak = long * 60;
    setMode(mode); // reset timer to new duration
  }

  settingsModal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", updateDisplay);
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
