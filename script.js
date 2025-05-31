document.addEventListener('DOMContentLoaded', () => {
    // --- Section Toggle Functionality ---
    const sectionToggleButtons = document.querySelectorAll('.section-toggle-btn');

    sectionToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetContent = document.getElementById(targetId);

            const isVisible = targetContent.classList.contains('content-visible');

            // Toggle content visibility
            targetContent.classList.toggle('content-visible', !isVisible);
            targetContent.classList.toggle('content-collapsed', isVisible);

            // Update button text
            const sectionLabel = targetId.includes('ingredients') ? 'Ingredients' : 'Instructions';
            button.textContent = `${isVisible ? 'Show' : 'Hide'} ${sectionLabel}`;

            // Scroll into view if content is being revealed
            if (!isVisible) {
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // --- Underline effect for Section Toggle Buttons (on click) ---
            // Remove underline from all other buttons
            sectionToggleButtons.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('underline');
                }
            });

            // Toggle underline for the clicked button
            if (!isVisible) { // Only underline if the section is being expanded
                button.classList.add('underline');
            } else { // Remove underline if the section is being collapsed
                button.classList.remove('underline');
            }
        });
    });


    // --- Cooking Steps Interactivity ---
    const startCookingBtn = document.getElementById('startCookingBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const recipeSteps = document.querySelectorAll('.instruction-step');
    const progressBar = document.getElementById('progressBar');
    const timerDisplay = document.getElementById('countdownTimer');
    const timerDisplayContainer = document.querySelector('.timer-display');
    const prepTimeSpan = document.getElementById('prepTimeDisplay');

    let currentStepIndex = -1;
    let timerInterval;
    let totalPrepTimeSeconds = 0;

    // Get total prep time from HTML
    if (prepTimeSpan) {
        const prepTimeText = prepTimeSpan.textContent;
        const matches = prepTimeText.match(/(\d+)\s*minutes/i);
        if (matches && matches[1]) {
            totalPrepTimeSeconds = parseInt(matches[1]) * 60;
        }
    }


    function updateProgressBar() {
        if (!progressBar) return; // Exit if progressBar is not found
        if (recipeSteps.length === 0) {
            progressBar.style.width = '100%';
            return;
        }
        const progress = ((currentStepIndex + 1) / recipeSteps.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function startTimer(durationInSeconds) {
        if (!timerDisplay || !timerDisplayContainer) return; // Exit if timer elements are not found

        let timerSeconds = durationInSeconds;
        timerDisplayContainer.classList.remove('hidden');

        clearInterval(timerInterval); // Clear any existing timer to prevent multiple timers running

        timerInterval = setInterval(() => {
            const minutes = Math.floor(timerSeconds / 60);
            const seconds = timerSeconds % 60;

            timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00';
                timerDisplayContainer.style.backgroundColor = '#d9534f';
                let timerLabel = timerDisplayContainer.querySelector('.timer-label');
                if (!timerLabel) { // If label doesn't exist, create it and prepend
                    timerLabel = document.createElement('span');
                    timerLabel.classList.add('timer-label');
                    timerDisplayContainer.prepend(timerLabel);
                }
                timerLabel.textContent = 'Time Up! '; // Added space for separation
            }
            timerSeconds--;
        }, 1000);
    }

    // Event listener for Start Cooking button
    if (startCookingBtn) {
        startCookingBtn.addEventListener('click', () => {
            const instructionsContent = document.getElementById('instructions-content');
            if (instructionsContent && instructionsContent.classList.contains('content-collapsed')) {
                instructionsContent.classList.remove('content-collapsed');
                instructionsContent.classList.add('content-visible');
                const instructionsToggleButton = document.querySelector('.section-toggle-btn[data-target="instructions-content"]');
                if (instructionsToggleButton) {
                    instructionsToggleButton.textContent = 'Hide Instructions';
                    instructionsToggleButton.classList.remove('underline'); // Ensure instruction button is not underlined on start
                }
                instructionsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            startCookingBtn.classList.add('hidden');
            if (nextStepBtn) {
                nextStepBtn.classList.remove('hidden');
            }

            currentStepIndex = 0;
            if (recipeSteps[currentStepIndex]) {
                recipeSteps[currentStepIndex].classList.add('highlighted');
                recipeSteps[currentStepIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            updateProgressBar();
            if (totalPrepTimeSeconds > 0) {
                startTimer(totalPrepTimeSeconds);
            } else if (timerDisplayContainer) {
                 timerDisplayContainer.classList.add('hidden'); // Hide timer if no prep time
            }
        }, { once: true }); // Only allow this click to happen once
    }

    // Event listener for Next Step button
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (currentStepIndex >= 0 && currentStepIndex < recipeSteps.length) {
                recipeSteps[currentStepIndex].classList.remove('highlighted');
            }

            currentStepIndex++;

            if (currentStepIndex < recipeSteps.length) {
                recipeSteps[currentStepIndex].classList.add('highlighted');
                recipeSteps[currentStepIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                updateProgressBar();
            } else {
                nextStepBtn.textContent = 'Recipe Finished!';
                nextStepBtn.disabled = true;
                nextStepBtn.style.backgroundColor = '#6c757d';
                nextStepBtn.style.boxShadow = 'none';
                updateProgressBar();
                clearInterval(timerInterval);
                if (timerDisplayContainer) {
                    timerDisplayContainer.style.backgroundColor = '#28a745';
                    let timerLabel = timerDisplayContainer.querySelector('.timer-label');
                    if (!timerLabel) {
                        timerLabel = document.createElement('span');
                        timerLabel.classList.add('timer-label');
                        timerDisplayContainer.prepend(timerLabel);
                    }
                    timerLabel.textContent = 'Enjoy! ';
                }
            }
        });
    }

    // --- Print Functionality ---
    const printRecipeBtn = document.getElementById('printRecipeBtn');
    if (printRecipeBtn) {
        printRecipeBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Initialize state for toggle buttons on page load
    sectionToggleButtons.forEach(button => {
        const targetId = button.dataset.target;
        const targetContent = document.getElementById(targetId);
        const sectionLabel = targetId.includes('ingredients') ? 'Ingredients' : 'Instructions';

        if (targetContent && targetContent.classList.contains('content-visible')) {
            button.textContent = `Hide ${sectionLabel}`;
        } else {
            button.textContent = `Show ${sectionLabel}`;
        }
    });

    // NOTE: Removed the specific "1 cup" click handler because the request is now for HOVER on ALL ingredients.
    // If you need the click handler for "1 cup" in addition to general hover, let me know.
});