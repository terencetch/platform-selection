// Importing Firebase modules
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

// Initialize Firebase (Firebase app is already initialized in index.html)
const database = getDatabase();

// Get the reference to the platform data in Firebase Realtime Database
const platformsRef = ref(database, 'platforms');

// Function to create the platform UI dynamically
function createPlatformUI(platformData) {
    const tableBody = document.getElementById('platforms');

    // Clear existing rows before rendering new data
    tableBody.innerHTML = '';

    // Convert the platformData object to an array and reverse it
    const platformArray = Object.values(platformData); // Convert to an array
    platformArray.reverse(); // Now we can reverse the array

    // Loop through each platform and create a row in the table
    for (let platformId = 0; platformId < platformArray.length; platformId++) {
        const platform = platformArray[platformId];
        const row = document.createElement('tr');

        // Platform number column
        const platformCell = document.createElement('td');
        platformCell.textContent = `Platform ${10 - platformId}`;  // Display Platform 10 at the top
        row.appendChild(platformCell);

        // Create cells for each user (Beleth, P0NY, UnsungHero, AhoyCaptain)
        ['Beleth', 'P0NY', 'UnsungHero', 'AhoyCaptain'].forEach(user => {
            const userCell = document.createElement('td');
            const checkboxContainer = document.createElement('div');
            checkboxContainer.classList.add('checkbox-container');

            // Create checkboxes for 1, 2, 3, 4 choices
            for (let choice = 1; choice <= 4; choice++) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${user}-${platformId}-${choice}`;
                checkbox.value = choice;

                // Add label under the checkbox
                const label = document.createElement('label');
                label.textContent = choice;
                label.setAttribute('for', checkbox.id);

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);

                // Event listener for checkbox selection
                checkbox.addEventListener('change', () => {
                    handleChoiceSelection(user, platformId, choice, platform);
                });
            }

            userCell.appendChild(checkboxContainer);
            row.appendChild(userCell);
        });

        tableBody.appendChild(row);
    }
}

// Function to handle choice selection for each user
function handleChoiceSelection(user, platformId, choice, platform) {
    const userIndex = ['Beleth', 'P0NY', 'UnsungHero', 'AhoyCaptain'].indexOf(user);

    // Disable other choices for this user in the selected platform
    disableOtherChoicesForUser(platformId, userIndex, choice, platform);

    // Disable other users from selecting the same choice in the platform
    disableOtherUsers(platformId, choice, userIndex);

    // Check if the last choice should be colored green
    checkLastChoice(platformId);
}

// Disable other choices for a user in the selected platform
function disableOtherChoicesForUser(platformId, userIndex, choice, platform) {
    const userCells = document.querySelectorAll(`#platforms tr:nth-child(${platformId + 1}) td`);
    const userCell = userCells[userIndex];

    userCell.querySelectorAll('input[type="checkbox"]').forEach(input => {
        if (input.value !== String(choice)) {
            input.disabled = true;
        } else {
            input.disabled = false; // Allow user to uncheck their own choice
        }
    });
}

// Disable other users from selecting the same choice in the platform
function disableOtherUsers(platformId, choice, userIndex) {
    const rows = document.querySelectorAll(`#platforms tr:nth-child(${platformId + 1}) td`);
    rows.forEach((cell, idx) => {
        if (idx !== userIndex) {
            const checkboxes = cell.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.value === String(choice)) {
                    checkbox.disabled = true; // Disable the same choice for other users
                }
            });
        }
    });
}

// Check if the last choice should be green (indicating the last available choice for the platform)
function checkLastChoice(platformId) {
    const platformRow = document.querySelector(`#platforms tr:nth-child(${platformId + 1})`);
    const checkboxes = platformRow.querySelectorAll('input[type="checkbox"]');

    let selectedChoices = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedChoices.push(checkbox.value);
        }
    });

    // Find the last unselected choice
    if (selectedChoices.length === 3) {
        const lastChoice = [1, 2, 3, 4].find(choice => !selectedChoices.includes(choice));

        // Apply the green background color to the last remaining choice
        checkboxes.forEach(checkbox => {
            if (checkbox.value === String(lastChoice)) {
                checkbox.parentElement.classList.add('selected-last');
            }
        });
    }
}

// Fetch data from Firebase and populate the table
onValue(platformsRef, (snapshot) => {
    const platformData = snapshot.val();
    if (platformData) {
        createPlatformUI(platformData);
    }
});
