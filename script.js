// Importing Firebase modules
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

// Initialize Firebase (Firebase app is already initialized in index.html)
const database = getDatabase();

// Disable other choices for the user (add a check to ensure the elements exist)
function disableOtherChoicesForUser(platform, user, choice) {
    const platformRow = document.querySelector(`#platform-${platform}`);
    if (!platformRow) return;

    const checkboxes = platformRow.querySelectorAll(`input[type="checkbox"]`);
    checkboxes.forEach((checkbox, index) => {
        if (index + 1 !== choice) {
            checkbox.disabled = true; // Disable other checkboxes except the one selected
        }
    });
}

// Function to create the platform UI dynamically
function createPlatformUI(platformData) {
    const platformTableBody = document.getElementById('platforms');
    
    // Loop through each platform (Platform 1 to Platform 10)
    Object.keys(platformData).forEach(platform => {
        const platformRow = document.createElement('tr');
        platformRow.id = `platform-${platform}`;

        // Platform number cell
        const platformCell = document.createElement('td');
        platformCell.textContent = `Platform ${platform}`;
        platformRow.appendChild(platformCell);

        // Create cells for each user
        const users = ["Beleth", "P0NY", "UnsungHero", "AhoyCaptain"];
        users.forEach(user => {
            const userCell = document.createElement('td');
            userCell.classList.add(user);

            // Create choice options for each user
            const choiceContainer = document.createElement('div');
            choiceContainer.classList.add('choice-container');

            for (let i = 1; i <= 4; i++) {
                const checkboxWrapper = document.createElement('div');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${user}-${platform}-${i}`;
                checkbox.value = i;
                
                // Add a label for each checkbox
                const label = document.createElement('label');
                label.setAttribute('for', checkbox.id);
                label.textContent = i;

                checkboxWrapper.appendChild(checkbox);
                checkboxWrapper.appendChild(label);
                choiceContainer.appendChild(checkboxWrapper);

                // If the user has selected this choice, disable others
                if (platformData[platform] && platformData[platform][user] && platformData[platform][user] === i) {
                    checkbox.checked = true;
                    disableOtherChoicesForUser(platform, user, i);
                }

                // Handle checkbox change event
                checkbox.addEventListener('change', function () {
                    if (checkbox.checked) {
                        disableOtherChoicesForUser(platform, user, i);
                    } else {
                        // Enable all checkboxes if none is selected
                        enableAllChoicesForUser(platform);
                    }
                });
            }

            userCell.appendChild(choiceContainer);
            platformRow.appendChild(userCell);
        });

        platformTableBody.appendChild(platformRow);
    });
}

// Enable all choices for a user (to un-grey out options if the user unchecks their choice)
function enableAllChoicesForUser(platform) {
    const platformRow = document.querySelector(`#platform-${platform}`);
    if (!platformRow) return;

    const checkboxes = platformRow.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = false; // Enable all checkboxes
    });
}


// Fetch data from Firebase and populate the table
onValue(platformsRef, (snapshot) => {
    const platformData = snapshot.val();
    if (platformData) {
        createPlatformUI(platformData);
    }
});
