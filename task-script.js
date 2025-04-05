function addTask() {
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const taskList = document.getElementById("taskList");

  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (!taskText || !deadline) return;

  const task = {
    text: taskText,
    deadline: deadline,
    id: Date.now(),
  };

  // Save to localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTasks();
  taskInput.value = "";
  deadlineInput.value = "";
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  taskList.innerHTML = ""; // Clear list

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${task.text}</strong> - due ${new Date(
      task.deadline
    ).toLocaleString()}
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
    taskList.appendChild(li);
  });
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Call this when page loads
document.addEventListener("DOMContentLoaded", renderTasks);
