const users = ["Beleth", "P0NY", "UnsungHero", "AhoyCaptain"];
const platforms = 10;
const selections = {};

function createPlatformUI() {
    const container = document.getElementById("platforms");

    for (let i = 1; i <= platforms; i++) {
        const div = document.createElement("div");
        div.classList.add("platform");
        div.innerHTML = `<h3>Platform ${i}</h3>`;
        
        users.forEach(user => {
            let select = document.createElement("select");
            select.dataset.platform = i;
            select.dataset.user = user;

            for (let n = 1; n <= 4; n++) {
                let option = document.createElement("option");
                option.value = n;
                option.textContent = n;
                select.appendChild(option);
            }

            select.addEventListener("change", updateSelections);
            div.appendChild(document.createTextNode(`${user}: `));
            div.appendChild(select);
            div.appendChild(document.createElement("br"));
        });

        container.appendChild(div);
    }
}

function updateSelections(event) {
    let { platform, user } = event.target.dataset;
    let value = event.target.value;

    selections[platform] = selections[platform] || {};
    selections[platform][user] = value;

    // Restrict other users
    users.forEach(otherUser => {
        if (otherUser !== user) {
            let selects = document.querySelectorAll(`select[data-platform='${platform}'][data-user='${otherUser}']`);
            selects.forEach(sel => {
                [...sel.options].forEach(opt => {
                    opt.disabled = Object.values(selections[platform]).includes(opt.value);
                });
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", createPlatformUI);
