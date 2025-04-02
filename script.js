// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsuTYdBcFTGRYja0ONqRaW_es2eSCIeKA",
  authDomain: "platform-selection.firebaseapp.com",
  databaseURL: "https://platform-selection-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "platform-selection",
  storageBucket: "platform-selection.firebasestorage.app",
  messagingSenderId: "937466148910",
  appId: "1:937466148910:web:42406630f4d64409e947bf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const platformsRef = db.ref("platforms");

// Fetch data from Firebase and render the table
platformsRef.once("value", function(snapshot) {
    const platforms = snapshot.val();
    createPlatformUI(platforms);
});

// Create platform UI based on Firebase data
function createPlatformUI(platforms) {
    const table = document.getElementById("platform-table");
    table.innerHTML = ""; // Clear the table before rendering

    for (let i = 10; i >= 1; i--) {
        const platform = platforms[`platform${i}`];

        if (!platform) continue; // Skip empty platforms

        const row = document.createElement("tr");
        const platformCell = document.createElement("td");
        platformCell.textContent = `Platform ${i}`;
        row.appendChild(platformCell);

        // Create user columns for each platform
        const users = ["Beleth", "P0NY", "UnsungHero", "AhoyCaptain"];
        users.forEach(user => {
            const userCell = document.createElement("td");
            userCell.classList.add("checkbox-container");

            // Create checkboxes for each user
            for (let choice = 1; choice <= 4; choice++) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = choice;
                checkbox.disabled = platform[user] && platform[user] !== choice;

                // If this is the user's selection, check the box
                if (platform[user] === choice) {
                    checkbox.checked = true;
                }

                // Add event listener to handle checkbox clicks
                checkbox.addEventListener("change", function() {
                    handleChoiceChange(i, user, choice, checkbox.checked);
                });

                const label = document.createElement("label");
                label.textContent = choice;

                userCell.appendChild(checkbox);
                userCell.appendChild(label);
            }

            row.appendChild(userCell);
        });

        table.appendChild(row);
    }
}

// Handle choice changes in the table
function handleChoiceChange(platformNum, user, choice, checked) {
    const platformRef = db.ref(`platforms/platform${platformNum}/${user}`);

    if (checked) {
        platformRef.set(choice);
    } else {
        platformRef.remove();
    }
}
