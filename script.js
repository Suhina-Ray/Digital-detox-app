let focusTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;

let currentTime = focusTime;
let sessionCount = 0;
let isFocus = true;
let interval;
let timerRunning = false;
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

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

      // Show notification and play sound
      sendNotification();
      playSound();

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
function sendNotification() {
  if (Notification.permission === "granted") {
    new Notification("⏰ Timer Finished!", {
      body: isFocus ? "Time for a break!" : "Back to work!",
      icon: "icon.png", // Optional - add icon file in your project folder
    });
  }
}

function playSound() {
  const audio = new Audio("alarm.mp3"); // Add a sound file named 'alarm.mp3' in your folder
  audio.play();
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
function showTab(tabId) {
  document.getElementById("timerTab").style.display = "none";
  document.getElementById("taskTab").style.display = "none";
  document.getElementById(tabId).style.display = "block";
}

const taskList = [];

function addTask() {
  const taskName = document.getElementById("taskInput").value;
  const deadlineInput = document.getElementById("deadlineInput").value;
  if (!taskName || !deadlineInput)
    return alert("Please enter both task and deadline.");

  const deadline = new Date(deadlineInput);
  const task = { name: taskName, deadline };
  taskList.push(task);

  displayTasks();
  checkDeadlines();
  document.getElementById("taskInput").value = "";
  document.getElementById("deadlineInput").value = "";
}

function displayTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  taskList.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = `${task.name} — Due: ${task.deadline.toLocaleString()}`;
    list.appendChild(li);
  });
}

function checkDeadlines() {
  setInterval(() => {
    const now = new Date();
    taskList.forEach((task) => {
      const timeDiff = task.deadline - now;
      if (timeDiff <= 10 * 60 * 1000 && timeDiff > 0 && !task.reminded) {
        alert(`Reminder: Your task "${task.name}" is due soon!`);
        task.reminded = true; // So it doesn't repeat
      }
    });
  }, 60000); // check every minute
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
