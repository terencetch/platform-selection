// Initialize Firebase
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

// Initialize Firebase app and database
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Set up the platform data
let platformData = {};

// Load platform data from Firebase and render it
function loadPlatformData() {
    const dbRef = firebase.database().ref('platforms/');
    dbRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            platformData = snapshot.val();
            renderPlatformTable();
        } else {
            console.log("No data available");
        }
    });
}

// Render the platform selection table
function renderPlatformTable() {
    const tableBody = document.getElementById('platforms-table-body');
    tableBody.innerHTML = ''; // Clear the table

    // Loop through platforms and display them
    for (let i = 10; i >= 1; i--) {
        const row = document.createElement('tr');
        row.classList.add('platform-row');
        
        const platformCell = document.createElement('td');
        platformCell.textContent = `Platform ${i}`;
        row.appendChild(platformCell);

        const users = ['Beleth', 'P0NY', 'UnsungHero', 'AhoyCaptain'];

        users.forEach(user => {
            const userCell = document.createElement('td');
            userCell.classList.add('user-cell');

            const checkboxContainer = document.createElement('div');
            const checkboxes = [1, 2, 3, 4];

            checkboxes.forEach((choice) => {
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = `${user}-platform-${i}`;
                checkbox.value = choice;

                // Disable checkboxes that are already selected by others
                if (platformData[`platform${i}`] && Object.values(platformData[`platform${i}`]).includes(choice) && platformData[`platform${i}`][user] !== choice) {
                    checkbox.disabled = true;
                }

                // If it's the last user and no choice is selected, make the last choice green
                if (user === 'AhoyCaptain' && Object.values(platformData[`platform${i}`]).length === 3 && !checkbox.checked) {
                    checkbox.style.backgroundColor = 'green';
                }

                // Add checkbox to the container
                checkboxContainer.appendChild(checkbox);
            });

            userCell.appendChild(checkboxContainer);
            row.appendChild(userCell);
        });

        tableBody.appendChild(row);
    }
}

// Initialize and load data on page load
window.onload = function () {
    loadPlatformData();
};

