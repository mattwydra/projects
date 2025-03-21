document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const dueDateInput = document.getElementById('due-date');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const clearAllBtn = document.getElementById('clear-all');
    const saveListBtn = document.getElementById('save-list');
    const importListBtn = document.getElementById('import-list');
    const importFileInput = document.getElementById('import-file');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close-modal');
    const editForm = document.getElementById('edit-form');
    const editIdInput = document.getElementById('edit-id');
    const editTextInput = document.getElementById('edit-text');
    const editPriorityInput = document.getElementById('edit-priority');
    const editDateInput = document.getElementById('edit-date');
    const themeSwitch = document.getElementById('theme-switch');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const pendingTasksElement = document.getElementById('pending-tasks');
    
    // Task Template
    const taskTemplate = document.getElementById('task-template');
    
    // State
    let tasks = [];
    let currentFilter = 'all';
    let currentSort = 'added';
    let searchQuery = '';
    
    // Task Class
    class Task {
        constructor(id, text, completed = false, priority = 'medium', dueDate = '') {
            this.id = id;
            this.text = text;
            this.completed = completed;
            this.priority = priority;
            this.dueDate = dueDate;
            this.createdAt = new Date().toISOString();
        }
    }
    
    // Initialize
    function init() {
        loadTasks();
        renderTasks();
        setupEventListeners();
        loadTheme();
    }
    
    // Load tasks from local storage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    }
    
    // Update statistics
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        totalTasksElement.textContent = totalTasks;
        completedTasksElement.textContent = completedTasks;
        pendingTasksElement.textContent = pendingTasks;
    }
    
    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Check if date is overdue or today
    function getDateStatus(dateString) {
        if (!dateString) return '';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dueDate = new Date(dateString);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
            return 'overdue';
        } else if (dueDate.getTime() === today.getTime()) {
            return 'today';
        }
        return '';
    }
    
    // Create task element
    function createTaskElement(task) {
        const taskElement = document.importNode(taskTemplate.content, true).querySelector('.task');
        
        // Set task ID
        taskElement.dataset.id = task.id;
        
        // Set completed class if needed
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        
        // Set checkbox state
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.checked = task.completed;
        
        // Set task text
        const taskText = taskElement.querySelector('.task-text');
        taskText.textContent = task.text;
        
        // Set priority
        const priorityBadge = taskElement.querySelector('.task-priority');
        priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        priorityBadge.classList.add(`priority-${task.priority}`);
        
        // Set due date if exists
        const dateElement = taskElement.querySelector('.task-date');
        if (task.dueDate) {
            const dateStatus = getDateStatus(task.dueDate);
            dateElement.textContent = formatDate(task.dueDate);
            if (dateStatus) {
                dateElement.classList.add(dateStatus);
            }
        } else {
            dateElement.remove();
        }
        
        return taskElement;
    }
    
    // Filter tasks based on current criteria
    function filterTasks() {
        let filteredTasks = [...tasks];
        
        // Apply search filter
        if (searchQuery) {
            filteredTasks = filteredTasks.filter(task => 
                task.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply category filter
        if (currentFilter === 'active') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }
        
        // Apply sorting
        filteredTasks.sort((a, b) => {
            switch (currentSort) {
                case 'due':
                    // Sort by due date (null dates at the end)
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                
                case 'priority':
                    // Sort by priority (high > medium > low)
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                
                case 'alphabetical':
                    // Sort alphabetically
                    return a.text.localeCompare(b.text);
                
                case 'added':
                default:
                    // Sort by creation date (newest first)
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        
        return filteredTasks;
    }
    
    // Render tasks to the DOM
    function renderTasks() {
        // Clear current task list
        taskList.innerHTML = '';
        
        // Get filtered and sorted tasks
        const filteredTasks = filterTasks();
        
        // Create task elements
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        
        // Show empty state if needed
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No tasks to display';
            taskList.appendChild(emptyMessage);
        }
        
        // Update statistics
        updateStats();
    }
    
    // Add a new task
    function addTask(text, priority, dueDate) {
        const id = Date.now().toString();
        const newTask = new Task(id, text, false, priority, dueDate);
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    }
    
    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    // Toggle task completion
    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }
    
    // Edit a task
    function editTask(id, text, priority, dueDate) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.text = text;
            task.priority = priority;
            task.dueDate = dueDate;
            saveTasks();
            renderTasks();
        }
    }
    
    // Clear completed tasks
    function clearCompletedTasks() {
        if (confirm('Are you sure you want to remove all completed tasks?')) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        }
    }
    
    // Clear all tasks
    function clearAllTasks() {
        if (confirm('Are you sure you want to remove all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks