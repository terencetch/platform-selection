// Firebase config (same as before)
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

// Initialize Firebase (same as before)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const platformsRef = ref(database, 'platforms');

// Function to create the platform table UI (same as before)
function createPlatformUI() {
  const platformTableBody = document.getElementById('platforms');
  platformTableBody.innerHTML = '';

  for (let i = 10; i >= 1; i--) {
    const row = document.createElement('tr');
    const platformCell = document.createElement('td');
    platformCell.textContent = `Platform ${i}`;
    row.appendChild(platformCell);

    ['Beleth', 'P0NY', 'UnsungHero', 'AhoyCaptain'].forEach(user => {
      const userCell = document.createElement('td');
      userCell.classList.add('choice-container');
      userCell.dataset.user = user;
      userCell.dataset.platform = i;

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
}

// Function to clear Firebase data (same as before)
function clearFirebaseData() {
  set(platformsRef, null);
}

// Listen for platform data in real-time and update UI accordingly (same as before)
onValue(platformsRef, (snapshot) => {
  const platformData = snapshot.val() || {};
  updateUIState(platformData);
});

// Handle checkbox selection and update Firebase in real-time (same as before)
document.getElementById('platforms').addEventListener('change', (event) => {
  if (event.target.type === 'checkbox') {
    const checkbox = event.target;
    const platformNumber = checkbox.dataset.platform;
    const user = checkbox.dataset.user;
    const choice = checkbox.value;

    const userRef = ref(database, `platforms/${platformNumber}/${user}`);
    set(userRef, checkbox.checked ? choice : null);
  }
});

// Function to update UI state (disabling checkboxes, setting green background, and updating checked state)
function updateUIState(platformData) {
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

    checkboxes.forEach(checkbox => {
      checkbox.disabled = selectedChoice && checkbox.value !== selectedChoice;
    });

    const platformUsersData = platformData[platform] || {};
    Object.entries(platformUsersData).forEach(([otherUser, otherChoice]) => {
      if (otherUser !== user) {
        checkboxes.forEach(checkbox => {
          checkbox.checked = checkbox.value === otherChoice;
          if (checkbox.checked) {
            checkbox.disabled = true;
          }
        });
      } else {
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkbox.value === platformUsersData[user]
        })
      }
    });

    const uncheckedChoices = Array.from(checkboxes).filter(checkbox => !checkbox.checked && !checkbox.disabled);
    if (uncheckedChoices.length === 1) {
      uncheckedChoices[0].parentElement.style.backgroundColor = 'green';
    } else {
      checkboxes.forEach(checkbox => {
        checkbox.parentElement.style.backgroundColor = '';
      });
    }
  });
}

// Clear Firebase data and create initial UI (same as before)
clearFirebaseData();
createPlatformUI();
