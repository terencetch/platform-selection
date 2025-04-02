const users = ["Beleth", "P0NY", "UnsungHero", "AhoyCaptain"];
const platforms = 10;
const selections = {};

function createPlatformUI() {
    const tbody = document.getElementById("platforms");

    // Create rows starting from Platform 1 at the bottom and Platform 10 at the top
    for (let i = platforms; i >= 1; i--) {
        const row = document.createElement("tr");

        // Platform Number Column
        const platformCell = document.createElement("td");
        platformCell.textContent = `Platform ${i}`;
        row.appendChild(platformCell);

        // Create Selection Columns for each user (choices 1-4)
        users.forEach(user => {
            const cell = document.createElement("td");
            const choices = [1, 2, 3, 4];  // Choices for each platform

            const choiceContainer = document.createElement("div");
            choiceContainer.classList.add("choice-container");

            choices.forEach(choice => {
                let label = document.createElement("label");
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.dataset.platform = i;
                checkbox.dataset.user = user;
                checkbox.dataset.choice = choice;
                checkbox.addEventListener("change", updateSelections);

                let choiceLabel = document.createElement("span");
                choiceLabel.classList.add("choice-label");
                choiceLabel.textContent = choice;

                label.appendChild(checkbox);
                label.appendChild(choiceLabel);
                choiceContainer.appendChild(label);
            });

            cell.appendChild(choiceContainer);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }
}

function updateSelections(event) {
    let checkbox = event.target;
    let platform = checkbox.dataset.platform;
    let choice = checkbox.dataset.choice;
    let user = checkbox.dataset.user;

    // If the checkbox is checked, store the selection, and disable others for that platform
    if (checkbox.checked) {
        selections[platform] = selections[platform] || {};
        selections[platform][choice] = user;

        // Disable other users from selecting this choice
        disableOtherUsers(platform, choice, user);
        checkLastChoice(platform);
    } else {
        // If unchecked, remove the selection and re-enable the choices
        delete selections[platform][choice];
        enableOtherUsers(platform, choice);
        checkLastChoice(platform);
    }
}

function disableOtherUsers(platform, selectedChoice, selectedUser) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (checkbox.dataset.choice === selectedChoice && checkbox.dataset.user !== selectedUser) {
            checkbox.disabled = true; // Disable for other users
        }
    });
}

function enableOtherUsers(platform, selectedChoice) {
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (!Object.values(selections[platform]).includes(selectedChoice)) {
            checkbox.disabled = false; // Re-enable the choice if not selected
        }
    });
}

function checkLastChoice(platform) {
    const choices = [1, 2, 3, 4];
    const selectedChoices = Object.keys(selections[platform] || {}).map(choice => parseInt(choice));
    const remainingChoices = choices.filter(choice => !selectedChoices.includes(choice));

    // If only one choice is left, color it green
    document.querySelectorAll(`input[data-platform='${platform}']`).forEach(checkbox => {
        if (remainingChoices.length === 1 && parseInt(checkbox.dataset.choice) === remainingChoices[0]) {
            checkbox.parentElement.classList.add("selected-last");
        } else {
            checkbox.parentElement.classList.remove("selected-last");
        }
    });
}

document.addEventListener("DOMContentLoaded", createPlatformUI);
