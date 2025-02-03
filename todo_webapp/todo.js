const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load tasks from local storage on page load
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToDOM);
};

// Save tasks to local storage
const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add a task to the DOM
const addTaskToDOM = (task) => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.innerHTML = `
                <span>${task}</span>
                <button class="delete-btn">Delete</button>
            `;
    taskList.appendChild(taskDiv);

    // Add delete functionality
    taskDiv.querySelector('.delete-btn').addEventListener('click', () => {
        removeTask(task, taskDiv);
    });
};

// Remove a task from the DOM and local storage
const removeTask = (task, taskElement) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t !== task);
    saveTasks(updatedTasks);
    taskElement.remove();
};

// Handle form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    if (task) {
        addTaskToDOM(task);
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        saveTasks(tasks);
        taskInput.value = '';
    }
});

// Initialize the app
loadTasks();