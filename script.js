// Initialize Firebase
const { initializeApp } = firebase;
const { getDatabase, ref, set, get, child, onValue } = firebase.database;

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCsuTYdBcFTGRYja0ONqRaW_es2eSCIeKA",
  authDomain: "platform-selection.firebaseapp.com",
  databaseURL: "https://platform-selection.firebaseio.com", // Correct public database URL
  projectId: "platform-selection",
  storageBucket: "platform-selection.firebasestorage.app",
  messagingSenderId: "937466148910",
  appId: "1:937466148910:web:42406630f4d64409e947bf",
  measurementId: "G-LP3VWKX2F7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app);

// Variables for keeping track of platform data
let platformData = {};

// Function to load platform data from Firebase and render the table
function loadPlatformData() {
    const dbRef = ref(database, 'platforms/');
    onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
            platformData = snapshot.val();
            renderPlatformTable();
        } else {
            console.log("No data available");
        }
    });
}

// Function to render the platform table based on current data
function renderPlatformTable() {
    const tableBody = document.getElementById('platforms-table-body');
    tableBody.innerHTML = ''; // Clear the table

    for (let i = 10; i >= 1; i--) { // Loop through platforms 10 to 1
        const row = document.createElement('tr');
        row.classList.add('platform-row');
        const platformCell = document.createElement('td');
        platformCell.textContent = `Platform ${i}`;
        row.appendChild(platformCell);

        ['Beleth', 'P0NY', 'UnsungHero', 'AhoyCaptain'].forEach(user => {
            const userCell = document.createElement('td');
            userCell.classList.add('user-cell');

            const choiceContainer = document.createElement('div');
            const platformChoices = [1, 2, 3, 4];

            platformChoices.forEach(choice => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = choice;
                checkbox.disabled = platformData[`platform${i}`]?.[user]; // Disable if the user already made a choice

                // If the user has selected a choice, mark it checked
                if (platformData[`platform${i}`]?.[user] === choice) {
                    checkbox.checked = true;
                }

                // Handle user selection and unchecking
                checkbox.addEventListener('change', function() {
                    handleChoiceChange(i, user, choice, checkbox);
                });

                const choiceLabel = document.createElement('span');
                choiceLabel.textContent = choice;

                // Add choice to container
                choiceContainer.appendChild(checkbox);
                choiceContainer.appendChild(choiceLabel);
            });

            // Add the choice container to the user's cell
            userCell.appendChild(choiceContainer);
            row.appendChild(userCell);
        });

        tableBody.appendChild(row);
    }
}

// Function to handle the change of a user's choice
function handleChoiceChange(platformNumber, user, choice, checkbox) {
    const platformRef = ref(database, `platforms/platform${platformNumber}`);
    const updates = {};

    // If the checkbox is checked, set the choice
    if (checkbox.checked) {
        updates[user] = choice;
    } else {
        updates[user] = null;
    }

    // Write the updates to the database
    set(platformRef, updates);
}

// Function to initialize the app (called when the page loads)
function initializeApp() {
    loadPlatformData(); // Load and display platform data when the page is loaded
}

// Call the initialization function when the page loads
document.addEventListener("DOMContentLoaded", initializeApp);


document.addEventListener("DOMContentLoaded", createPlatformUI);
