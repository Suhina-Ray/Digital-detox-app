let focusTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;

let currentTime = focusTime;
let sessionCount = 0;
let isFocus = true;
let interval;
let timerRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const modeDisplay = document.getElementById("mode");
const sessionDisplay = document.getElementById("sessionCount");

// Show current time in MM:SS format
function updateTimerDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Start the countdown timer
function startTimer() {
  if (timerRunning) return;

  timerRunning = true;
  interval = setInterval(() => {
    currentTime--;
    updateTimerDisplay();

    if (currentTime <= 0) {
      clearInterval(interval);
      timerRunning = false;

      // Session complete, switch mode
      if (isFocus) {
        sessionCount++;
        sessionDisplay.textContent = `Sessions Completed: ${sessionCount}`;
        isFocus = false;
        if (sessionCount % 4 === 0) {
          currentTime = longBreakTime;
          modeDisplay.textContent = "Long Break";
        } else {
          currentTime = shortBreakTime;
          modeDisplay.textContent = "Short Break";
        }
      } else {
        isFocus = true;
        currentTime = focusTime;
        modeDisplay.textContent = "Focus";
      }

      updateTimerDisplay();
      startTimer(); // Auto-start next session
    }
  }, 1000);
}

// Reset timer to initial state
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

// Manual mode switch (Focus, Short Break, Long Break)
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

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// Initial display
updateTimerDisplay();
