// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const platformsRef = database.ref("platforms");

// Function to create the platform table UI
function createPlatformUI(platformData) {
    const platformTableBody = document.getElementById('platforms');
    platformTableBody.innerHTML = ''; // Clear existing table content

    // Iterate over platforms from 10 to 1 (reverse order)
    for (let i = 10; i >= 1; i--) {
        if (!platformData[i]) continue; // Skip undefined platform entries

        const row = document.createElement('tr');

        // Platform number cell
        const platformCell = document.createElement('td');
        platformCell.textContent = `Platform ${i}`;
        row.appendChild(platformCell);

        // Iterate through users
        ['Beleth', 'P0NY', 'UnsungHero', 'AhoyCaptain'].forEach(user => {
            const userCell = document.createElement('td');
            userCell.classList.add('choice-container');
            userCell.dataset.user = user;
            userCell.dataset.platform = i;

            let userChoice = platformData[i][user] || null;

            // Create checkboxes for choices (1 to 4)
            for (let choice = 1; choice <= 4; choice++) {
                const choiceWrapper = document.createElement('div');
                choiceWrapper.classList.add('choice-wrapper');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = choice;
                checkbox.dataset.platform = i;
                checkbox.dataset.user = user;

                if (userChoice == choice) {
                    checkbox.checked = true;
                }

                const label = document.createElement('div');
                label.classList.add('choice-label');
                label.textContent = choice;

                choiceWrapper.appendChild(checkbox);
                choiceWrapper.appendChild(label);
                userCell.appendChild(choiceWrapper);
            }

            row.appendChild(userCell);
        });

        platformTableBody.appendChild(row);
    }

    updateUIState();
}

// Fetch platform data from Firebase and update UI
platformsRef.on('value', (snapshot) => {
    const platformData = snapshot.val();
    if (platformData) {
        createPlatformUI(platformData);
    }
});

// Handle checkbox selection
document.getElementById('platforms').addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const checkbox = event.target;
        const platformNumber = checkbox.dataset.platform;
        const user = checkbox.dataset.user;
        const choice = checkbox.value;

        const userRef = platformsRef.child(platformNumber).child(user);

        if (checkbox.checked) {
            userRef.set(choice);
        } else {
            userRef.set(null);
        }
    }
});

// Function to update UI state (disabling checkboxes and setting green background)
function updateUIState() {
    document.querySelectorAll('.choice-container').forEach(userCell => {
        const platform = userCell.dataset.platform;
        const user = userCell.dataset.user;
        const checkboxes = userCell.querySelectorAll('input[type="checkbox"]');

        let selectedChoice = null;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedChoice = checkbox.value;
            }
        });

        checkboxes.forEach(checkbox => {
            if (selectedChoice && checkbox.value !== selectedChoice) {
                checkbox.disabled = true;
            } else {
                checkbox.disabled = false;
            }
        });

        // Green background for last remaining choice
        const uncheckedChoices = [...checkboxes].filter(checkbox => !checkbox.checked);
        if (uncheckedChoices.length === 1) {
            uncheckedChoices[0].parentElement.style.backgroundColor = 'green';
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.parentElement.style.backgroundColor = '';
            });
        }
    });
}

// Function to disable other choices for the user when one is selected
function disableOtherChoicesForUser(platform, user, selectedChoice) {
    const userCell = document.querySelector(`td[data-platform="${platform}"][data-user="${user}"]`);
    if (!userCell) return;

    const checkboxes = userCell.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.value !== selectedChoice) {
            checkbox.disabled = true;
        }
    });
}

// Function to enable all choices when the user unchecks their selection
function enableChoicesForUser(platform, user) {
    const userCell = document.querySelector(`td[data-platform="${platform}"][data-user="${user}"]`);
    if (!userCell) return;

    const checkboxes = userCell.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = false;
    });
}

// Listen for database updates and refresh UI
platformsRef.on('value', snapshot => {
    const platformData = snapshot.val();
    if (platformData) {
        createPlatformUI(platformData);
    }
});
