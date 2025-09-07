
const apiUrl = "http://localhost:5000/api/tasks";
// Format date as DD-MM-YYYY
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Fetch tasks
async function fetchTasks() {
    try {
        const res = await fetch(apiUrl);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
    }
}

// Add new task (no duplicates)
async function addTask() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!title) return showNotification("Task title is required!", "warning");

    // ✅ Check for duplicates before sending request
    const res = await fetch(apiUrl);
    const tasks = await res.json();
    if (tasks.some((task) => task.title.toLowerCase() === title.toLowerCase())) {
        return showNotification("Task with this title already exists!", "error");
    }

    // ✅ Send request to backend
    const addRes = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, dueDate }),
    });

    if (addRes.status === 400) {
        const error = await addRes.json();
        return showNotification(error.message, "error");
    }

    showNotification("Task added successfully!", "success");

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("priority").value = "Low";
    document.getElementById("dueDate").value = "";

    fetchTasks();
}



// Toggle task completion
async function toggleComplete(id, completed) {
    await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
}

// Delete task
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchTasks();
}



function renderTasks(tasks) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    // Create table
    const table = document.createElement("table");
    table.className =
        "w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden border-collapse";

    // Table header
    table.innerHTML = `
    <thead>
      <tr class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left">
        <th class="px-4 py-3 font-medium border border-gray-300">Title</th>
        <th class="px-4 py-3 font-medium border border-gray-300">Description</th>
        <th class="px-4 py-3 font-medium border border-gray-300">Priority</th>
        <th class="px-4 py-3 font-medium border border-gray-300">Due Date</th>
        <th class="px-4 py-3 font-medium border border-gray-300">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white"></tbody>
  `;

    const tbody = table.querySelector("tbody");

    tasks.forEach((task, index) => {
        const tr = document.createElement("tr");
        tr.className =
            "hover:bg-gray-100 transition duration-200 ease-in-out odd:bg-gray-50 even:bg-white";

        tr.innerHTML = `
      <td class="px-4 py-3 font-semibold border border-gray-300 ${task.completed ? "line-through text-gray-400" : "text-gray-800"
            }">
        ${task.title}
      </td>
      <td class="px-4 py-3 text-gray-600 border border-gray-300">${task.description || ""}</td>
      <td class="px-4 py-3 border border-gray-300">${getBatteryBars(task.priority)}</td>
      <td class="px-4 py-3 text-sm text-gray-500 border border-gray-300">
        ${task.dueDate ? formatDate(task.dueDate) : ""}
      </td>
      <td class="px-4 py-3 flex space-x-2 border border-gray-300">
        <button onclick="toggleComplete('${task._id}', ${task.completed})" 
          class="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition" 
          title="Toggle Complete">✔️</button>
        <button onclick="deleteTask('${task._id}')" 
          class="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition" 
          title="Delete Task">🗑️</button>
      </td>
    `;

        tbody.appendChild(tr);
    });

    list.appendChild(table);
}





// Load tasks on page load
fetchTasks();


// Show notification (below Add button)
function showNotification(message, type = "info") {
    const container = document.getElementById("notification-container");
    container.innerHTML = ""; // Clear old messages

    const colors = {
        success: "bg-green-100 text-green-700 border border-green-400",
        error: "bg-red-100 text-red-700 border border-red-400",
        info: "bg-blue-100 text-blue-700 border border-blue-400",
        warning: "bg-yellow-100 text-yellow-700 border border-yellow-400",
    };

    const div = document.createElement("div");
    div.className = `px-4 py-2 rounded-lg inline-block ${colors[type]} animate-fade-in`;
    div.innerText = message;

    container.appendChild(div);

    // Auto remove after 3s
    setTimeout(() => {
        div.classList.add("opacity-0", "transition-opacity", "duration-500");
        setTimeout(() => div.remove(), 500);
    }, 3000);
}

function getBatteryHTML(priority) {
    let cls = "battery-fill ";
    if (priority === "Low") cls += "battery-low";
    else if (priority === "Medium") cls += "battery-medium";
    else cls += "battery-high";

    return `
    <div class="battery">
      <div class="${cls}"></div>
    </div>
  `;
}

function getBatteryBars(priority) {
    if (!priority) return "";

    priority = priority.toLowerCase();

    // Base container: horizontal flex
    let bars = `<div class="flex space-x-1 items-center">`;

    if (priority === "low") {
        bars += `
      <div class="w-6 h-3 bg-red-500 rounded"></div>
      <div class="w-6 h-3 bg-gray-300 rounded"></div>
      <div class="w-6 h-3 bg-gray-300 rounded"></div>
    `;
    } else if (priority === "medium") {
        bars += `
      <div class="w-6 h-3 bg-yellow-400 rounded"></div>
      <div class="w-6 h-3 bg-yellow-400 rounded"></div>
      <div class="w-6 h-3 bg-gray-300 rounded"></div>
    `;
    } else {
        // High
        bars += `
      <div class="w-6 h-3 bg-green-500 rounded"></div>
      <div class="w-6 h-3 bg-green-500 rounded"></div>
      <div class="w-6 h-3 bg-green-500 rounded"></div>
    `;
    }

    bars += `</div>`;
    return bars;
}




