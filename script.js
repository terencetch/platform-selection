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

        // Selection Columns (1-4)
        for (let n = 1; n <= 4; n++) {
            const cell = document.createElement("td");
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.platform = i;
            checkbox.dataset.number = n;
            checkbox.addEventListener("change", updateSelections);
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
}

function updateSelections(event) {
    let checkbox = event.target;
    let platform = checkbox.dataset.platform;
    let number = checkbox.dataset.number;

    if (checkbox.checked) {
        // Store the selection and disable other users from selecting the same number
        selections[platform] = selections[platform] || {};
        selections[platform][number] = checkbox;

        disableOtherUsers(platform, number, checkbox);
    } else {
        // Remove the selection and re-enable checkboxes
        delete selections[platform][number];
        enableOtherUsers(platform, number);
    }
}

function disableOtherUsers(platform, selectedNumber, userCheckbox) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (checkbox !== userCheckbox && checkbox.dataset.number === selectedNumber) {
            checkbox.disabled = true; // Disable for other users
        }
    });
}

function enableOtherUsers(platform, selectedNumber) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (!Object.keys(selections[platform] || {}).includes(selectedNumber)) {
            checkbox.disabled = false; // Re-enable if no one has selected it
        }
    });
}

document.addEventListener("DOMContentLoaded", createPlatformUI);
