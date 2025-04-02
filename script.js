// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  // Replace with your actual API Key
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace with your project ID
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",  // Replace with your database URL
    projectId: "YOUR_PROJECT_ID",  // Replace with your project ID
    storageBucket: "YOUR_PROJECT_ID.appspot.com",  // Replace with your storage bucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace with your messaging sender ID
    appId: "YOUR_APP_ID"  // Replace with your app ID
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

    // Update table logic after a change
    updateTable(platformNum);
}

// Disable other choices for the user
function disableOtherChoicesForUser(platform, user, choice) {
    const userChoices = Array.from(platform[user]);
    userChoices.forEach(selectedChoice => {
        if (selectedChoice !== choice) {
            const checkbox = document.querySelector(`input[value="${selectedChoice}"][data-user="${user}"]`);
            if (checkbox) checkbox.disabled = true;
        }
    });
}

// Disable other users from selecting this choice
function disableOtherUsers(platform, choice, user) {
    const otherUsers = ["Beleth", "P0NY", "UnsungHero", "AhoyCaptain"].filter(u => u !== user);
    otherUsers.forEach(otherUser => {
        const otherChoice = platform[otherUser];
        if (otherChoice === choice) {
            const checkbox = document.querySelector(`input[value="${choice}"][data-user="${otherUser}"]`);
            if (checkbox) checkbox.disabled = true;
        }
    });
}

// Check if there is only one remaining choice for the last user
function checkLastChoice(platform) {
    const users = ["Beleth", "P0NY", "UnsungHero", "AhoyCaptain"];
    users.forEach(user => {
        const userChoices = Object.values(platform).filter(choice => choice === user).length;
        if (userChoices === 3) {
            const remainingChoice = [1, 2, 3, 4].find(choice => !userChoices.includes(choice));
            if (remainingChoice) {
                document.querySelector(`input[value="${remainingChoice}"][data-user="${user}"]`).style.backgroundColor = 'green';
            }
        }
    });
}
