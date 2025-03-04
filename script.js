document.addEventListener('DOMContentLoaded', function () {
    const taskNameInput = document.getElementById('task-name');
    const reachInput = document.getElementById('reach');
    const reachValue = document.getElementById('reach-value');
    const impactInput = document.getElementById('impact');
    const impactValue = document.getElementById('impact-value');
    const confidenceInput = document.getElementById('confidence');
    const confidenceValue = document.getElementById('confidence-value');
    const effortInput = document.getElementById('effort');
    const effortValue = document.getElementById('effort-value');
    const saveButton = document.getElementById('save-task');
    const editButton = document.getElementById('edit-task');
    const deleteButton = document.getElementById('delete-task');
    const filterSection = document.getElementById('filter-section');
    const legendMessage = document.getElementById('legend-message');

    let tasks = [];
    let selectedTask = null;
    let nextId = 1; // Counter for unique IDs

    clearInputs();

    // Sync range and numeric inputs
    reachInput.addEventListener('change', () => {
        reachValue.value = reachInput.value;
    });
    reachValue.addEventListener('change', () => {
        reachInput.value = reachValue.value;
    });

    impactInput.addEventListener('change', () => {
        impactValue.value = impactInput.value;
    });
    impactValue.addEventListener('change', () => {
        impactInput.value = impactValue.value;
    });

    confidenceInput.addEventListener('change', () => {
        confidenceValue.value = confidenceInput.value;
    });
    confidenceValue.addEventListener('change', () => {
        confidenceInput.value = confidenceValue.value;
    });

    effortInput.addEventListener('change', () => {
        effortValue.value = effortInput.value;
    });
    effortValue.addEventListener('change', () => {
        effortInput.value = effortValue.value;
    });

    // Save task
    saveButton.addEventListener('click', function () {
        const task = {
            id: nextId++, // Assign a unique ID
            name: taskNameInput.value,
            reach: parseFloat(reachValue.value),
            impact: parseFloat(impactValue.value),
            confidence: parseFloat(confidenceValue.value),
            effort: parseFloat(effortValue.value),
            riceScore: calculateRiceScore(
                parseFloat(reachValue.value),
                parseFloat(impactValue.value),
                parseFloat(confidenceValue.value),
                parseFloat(effortValue.value)
            ),
        };

        tasks.push(task);
        updateMatrix();
        clearInputs();
    });

    // Edit task
    editButton.addEventListener('click', function () {
        if (selectedTask) {
            selectedTask.name = taskNameInput.value;
            selectedTask.reach = parseFloat(reachValue.value);
            selectedTask.impact = parseFloat(impactValue.value);
            selectedTask.confidence = parseFloat(confidenceValue.value);
            selectedTask.effort = parseFloat(effortValue.value);
            selectedTask.riceScore = calculateRiceScore(
                selectedTask.reach,
                selectedTask.impact,
                selectedTask.confidence,
                selectedTask.effort
            );

            updateMatrix();
            clearInputs();
        }
    });

    // Delete task
    deleteButton.addEventListener('click', function () {
        if (selectedTask) {
            tasks = tasks.filter(task => task.id !== selectedTask.id);
            updateMatrix();
            clearInputs();
        }
    });

    // Calculate RICE score (new formula)
    function calculateRiceScore(reach, impact, confidence, effort) {
        // Main variables: impact and effort
        const mainScore = impact / effort;

        // Secondary variables: reach and confidence (lower weight)
        const secondaryScore = (reach + confidence) * 0.5;

        // Final score
        const result = (mainScore + secondaryScore).toFixed(2);
        return result;
    }

    // Update the matrix
    function updateMatrix() {
        const sections = {
            'big-bets': document.querySelector('.big-bets .tasks'),
            'quick-wins': document.querySelector('.quick-wins .tasks'),
            'money-pit': document.querySelector('.money-pit .tasks'),
            'fill-ins': document.querySelector('.fill-ins .tasks'),
        };

        // Clear sections
        Object.values(sections).forEach(section => (section.innerHTML = ''));

        // Add tasks to the corresponding sections
        tasks.forEach(task => {
            const pill = document.createElement('div');
            pill.classList.add('pill');
            pill.textContent = `${task.name} (RICE: ${task.riceScore})`;
            pill.addEventListener('click', () => selectTask(task));

            if (task.riceScore > 8) {
                sections['big-bets'].appendChild(pill);
            } else if (task.riceScore >= 6 && task.riceScore <= 8) {
                sections['quick-wins'].appendChild(pill);
            } else if (task.riceScore > 2 && task.riceScore < 6) {
                sections['fill-ins'].appendChild(pill);
            } else {
                sections['money-pit'].appendChild(pill);
            }
        });

        updateLegend();
    }

    // Select task
    function selectTask(task) {
        selectedTask = task;
        taskNameInput.value = task.name;
        reachValue.value = task.reach;
        impactValue.value = task.impact;
        confidenceValue.value = task.confidence;
        effortValue.value = task.effort;
    }

    // Clear inputs
    function clearInputs() {
        taskNameInput.value = '';
        reachInput.value = 0;
        reachValue.value = 0;
        impactInput.value = 1;
        impactValue.value = 1;
        confidenceInput.value = 0;
        confidenceValue.value = 0;
        effortInput.value = 1;
        effortValue.value = 1;
        selectedTask = null;
    }

    // Update legend
    function updateLegend() {
        const counts = {
            'big-bets': document.querySelector('.big-bets .tasks').children.length,
            'quick-wins': document.querySelector('.quick-wins .tasks').children.length,
            'money-pit': document.querySelector('.money-pit .tasks').children.length,
            'fill-ins': document.querySelector('.fill-ins .tasks').children.length,
        };

        let message = '';
        if (counts['money-pit'] > 5) {
            message = 'Warning! You have many tasks in "Money Pit". Reconsider your strategy.';
        } else if (counts['big-bets'] > 3) {
            message = 'You have several "Big Bets". Make sure to plan them well.';
        } else {
            message = 'Everything seems to be in order. Keep it up!';
        }

        legendMessage.textContent = message;
    }

    // Filter tasks
    filterSection.addEventListener('change', function () {
        const filterValue = this.value;
        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            if (filterValue === 'all' || section.classList.contains(filterValue)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
});