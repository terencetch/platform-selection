// Firebase config (copy the values directly from index.html)
const firebaseConfig = {
  apiKey: "AIzaSyCsuTYdBcFTGRYja0ONqRaW_es2eSCIeKA",
  authDomain: "platform-selection.firebaseapp.com",
  databaseURL: "https://platform-selection-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "platform-selection",
  storageBucket: "platform-selection.firebasestorage.app",
  messagingSenderId: "937466148910",
  appId: "1:937466148910:web:42406630f4d64409e947bf",
  measurementId: "G-LP3VWKX2F7"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

const app = initializeApp(firebaseConfig);  // Initialize Firebase app with the config from index.html
const database = getDatabase(app);  // Get the database reference
const platformsRef = ref(database, 'platforms');  // Reference to 'platforms' node in the database

// Function to create the platform table UI
function createPlatformUI(platformData) {
    const platformTableBody = document.getElementById('platforms');
    platformTableBody.innerHTML = ''; // Clear existing table content

    // Iterate over platforms from 10 to 1 (reverse order)
    for (let i = 10; i >= 1; i--) {
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

            // Create checkboxes for choices (1 to 4) horizontally
            const choiceWrapperContainer = document.createElement('div');
            choiceWrapperContainer.classList.add('choice-wrapper-container');
            
            for (let choice = 1; choice <= 4; choice++) {
                const choiceWrapper = document.createElement('div');
                choiceWrapper.classList.add('choice-wrapper');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = choice;
                checkbox.dataset.platform = i;
                checkbox.dataset.user = user;

                // Always leave the checkboxes unchecked on page load
                checkbox.checked = false;

                const label = document.createElement('div');
                label.classList.add('choice-label');
                label.textContent = choice;

                choiceWrapper.appendChild(checkbox);
                choiceWrapper.appendChild(label);
                choiceWrapperContainer.appendChild(choiceWrapper);
            }

            userCell.appendChild(choiceWrapperContainer);
            row.appendChild(userCell);
        });

        platformTableBody.appendChild(row);
    }

    updateUIState();  // Call the updateUIState function to apply any state changes
}

// Fetch platform data from Firebase and update UI
onValue(platformsRef, (snapshot) => {
    const platformData = snapshot.val();
    if (platformData) {
        createPlatformUI(platformData); // Render UI based on Firebase data
    }
});

// Handle checkbox selection
document.getElementById('platforms').addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const checkbox = event.target;
        const platformNumber = checkbox.dataset.platform;
        const user = checkbox.dataset.user;
        const choice = checkbox.value;

        const userRef = ref(database, `platforms/${platformNumber}/${user}`);

        if (checkbox.checked) {
            set(userRef, choice); // Save the selected choice to Firebase
        } else {
            set(userRef, null); // If unchecked, remove the choice from Firebase
        }

        updateUIState(); // Update UI state after the change
    }
});

// Function to update UI state (disabling checkboxes and setting green background)
function updateUIState() {
    // Update each platform row individually
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

        // Disable other choices for the current user when one is selected
        checkboxes.forEach(checkbox => {
            if (selectedChoice && checkbox.value !== selectedChoice) {
                checkbox.disabled = true;
            } else {
                checkbox.disabled = false;
            }
        });

        // Disable selected choices for other users
        const allChoices = [];
        document.querySelectorAll('.choice-container').forEach(otherUserCell => {
            if (otherUserCell !== userCell && otherUserCell.dataset.platform === platform) {
                const otherUserCheckboxes = otherUserCell.querySelectorAll('input[type="checkbox"]');
                otherUserCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox.checked) {
                        allChoices.push(otherCheckbox.value);
                    }
                });
            }
        });

        checkboxes.forEach(checkbox => {
            if (allChoices.includes(checkbox.value)) {
                checkbox.disabled = true;
            }
        });

        // Green background for the last remaining choice (last user who selects)
        const uncheckedChoices = [...checkboxes].filter(checkbox => !checkbox.checked);
        if (uncheckedChoices.length === 1) {
            uncheckedChoices[0].parentElement.style.backgroundColor = 'green';
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.parentElement.style.backgroundColor = '';  // Reset background
            });
        }
    });
}
