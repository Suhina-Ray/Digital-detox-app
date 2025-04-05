let timer;
let timeLeft = 1500;
let mode = "focus";
let sessionCount = 0;
let points = parseInt(localStorage.getItem("points")) || 0;

const display = document.getElementById("timer-display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const sessionCounter = document.getElementById("sessionCount");
const pointDisplay = document.getElementById("pointDisplay");

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

function updatePointsDisplay() {
  pointDisplay.textContent = points;
  localStorage.setItem("points", points);
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
      if (mode === "focus") {
        points += 10;
        updatePointsDisplay();
      }
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
  document.getElementById("themeTab").style.display =
    tabId === "themeTab" ? "block" : "none";
}

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
    setMode(mode);
  }

  settingsModal.style.display = "none";
};

window.onload = function () {
  loadTasks();
  updateDisplay();
  updatePointsDisplay();
};

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");

  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    text: taskText,
    deadline: deadline,
  };

  const tasks = getTasksFromStorage();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTask(task);

  taskInput.value = "";
  deadlineInput.value = "";
}

function getTasksFromStorage() {
  const stored = localStorage.getItem("tasks");
  return stored ? JSON.parse(stored) : [];
}

function displayTask(task, index) {
  const list = document.getElementById("taskList");
  const li = document.createElement("li");
  li.textContent = task.deadline
    ? `${task.text} (Due: ${task.deadline})`
    : task.text;

  // Create Completed button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Completed";
  completeBtn.className = "complete-btn";
  completeBtn.onclick = () => {
    li.style.textDecoration = "line-through";
    completeBtn.disabled = true;
  };

  li.appendChild(completeBtn);
  list.appendChild(li);
}

function loadTasks() {
  const tasks = getTasksFromStorage();
  document.getElementById("taskList").innerHTML = "";
  tasks.forEach((task, index) => displayTask(task, index));
}

document.addEventListener("DOMContentLoaded", updateDisplay);
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

function unlockTheme(themeName) {
  const unlockedThemes =
    JSON.parse(localStorage.getItem("unlockedThemes")) || [];
  if (!unlockedThemes.includes(themeName)) {
    if (points >= 10) {
      points -= 10;
      unlockedThemes.push(themeName);
      localStorage.setItem("unlockedThemes", JSON.stringify(unlockedThemes));
      updatePointsDisplay();
      alert(`${themeName} theme unlocked!`);
    } else {
      alert("Not enough points to unlock this theme.");
    }
  } else {
    alert("Theme already unlocked.");
  }
}

function applyTheme(themeName) {
  const unlockedThemes =
    JSON.parse(localStorage.getItem("unlockedThemes")) || [];
  if (themeName === "default" || unlockedThemes.includes(themeName)) {
    document.body.className = themeName;
  } else {
    alert("You need to unlock this theme first.");
  }
}
