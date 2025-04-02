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
        selections[platform] = selections[platform] || {};
        selections[platform][number] = true;
        disableOtherSelections(platform, number);
    } else {
        delete selections[platform][number];
        enableSelections(platform);
    }
}

function disableOtherSelections(platform, selectedNumber) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (checkbox.dataset.number !== selectedNumber) {
            checkbox.disabled = selections[platform][checkbox.dataset.number] ? true : Object.keys(selections[platform]).length >= 4;
        }
    });
}

function enableSelections(platform) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        checkbox.disabled = false;
    });
}

document.addEventListener("DOMContentLoaded", createPlatformUI);
