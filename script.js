const users = ["Beleth", "P0NY", "UnsungHero", "AhoyCaptain"];
const platforms = 10;
const selections = {};

function createPlatformUI() {
    const tbody = document.getElementById("platforms");

    for (let i = 1; i <= platforms; i++) {
        const row = document.createElement("tr");

        // Platform Number Column
        const platformCell = document.createElement("td");
        platformCell.textContent = `Platform ${i}`;
        row.appendChild(platformCell);

        // Selection Columns (Choices 1-4 for each user)
        users.forEach(user => {
            const cell = document.createElement("td");
            
            for (let n = 1; n <= 4; n++) {
                let label = document.createElement("label");
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.dataset.platform = i;
                checkbox.dataset.user = user;
                checkbox.dataset.number = n;
                checkbox.addEventListener("change", updateSelections);

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${n} `));
                cell.appendChild(label);
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }
}

function updateSelections(event) {
    let checkbox = event.target;
    let platform = checkbox.dataset.platform;
    let number = checkbox.dataset.number;
    let user = checkbox.dataset.user;

    if (checkbox.checked) {
        // Store the selection and disable other users from selecting the same number
        selections[platform] = selections[platform] || {};
        selections[platform][number] = user;

        disableOtherUsers(platform, number, user);
    } else {
        // Remove the selection and re-enable checkboxes
        delete selections[platform][number];
        enableOtherUsers(platform, number);
    }
}

function disableOtherUsers(platform, selectedNumber, selectedUser) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (checkbox.dataset.number === selectedNumber && checkbox.dataset.user !== selectedUser) {
            checkbox.disabled = true; // Disable for other users
        }
    });
}

function enableOtherUsers(platform, selectedNumber) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (!Object.values(selections[platform]).includes(selectedNumber)) {
            checkbox.disabled = false; // Re-enable if no one has selected it
        }
    });
}

document.addEventListener("DOMContentLoaded", createPlatformUI);
