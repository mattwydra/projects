// DOM Elements
const textForm = document.getElementById('textForm');
const inputList = document.getElementById('inputList');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const bgImageInput = document.getElementById('bg-image');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

const bgImageUploadInput = document.getElementById('bg-image-upload');

// Save Preferences
saveBtn.addEventListener('click', () => {
    const bgColor = bgColorInput.value;
    const textColor = textColorInput.value;

    localStorage.setItem('backgroundColor', bgColor);
    localStorage.setItem('textColor', textColor);

    // Handle uploaded image
    const uploadedFile = bgImageUploadInput.files[0];
    if (uploadedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            localStorage.setItem('backgroundImage', imageUrl);
            document.body.style.backgroundImage = `url(${imageUrl})`;
        };
        reader.readAsDataURL(uploadedFile);
    } else {
        const existingImageUrl = localStorage.getItem('backgroundImage');
        if (existingImageUrl) {
            document.body.style.backgroundImage = `url(${existingImageUrl})`;
        }
    }

    loadPreferences();
});

// Load Preferences (updated to support uploaded image)
function loadPreferences() {
    const bgColor = localStorage.getItem('backgroundColor');
    const textColor = localStorage.getItem('textColor');
    const bgImage = localStorage.getItem('backgroundImage');

    if (bgColor) document.body.style.backgroundColor = bgColor;
    if (textColor) document.body.style.color = textColor;
    if (bgImage) document.body.style.backgroundImage = `url(${bgImage})`;

    bgColorInput.value = bgColor || '#ffffff';
    textColorInput.value = textColor || '#000000';
    bgImageUploadInput.value = ''; // Clear the file input
}

// Reset Preferences (updated to handle uploaded image)
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('backgroundColor');
    localStorage.removeItem('textColor');
    localStorage.removeItem('backgroundImage');
    loadPreferences();
});


// Manage Text Inputs
textForm.addEventListener('click', (event) => {
    const action = event.target.id;
    const inputText = textForm.text.value.trim();

    if (action === 'addBtn' && inputText) {
        const li = document.createElement('li');
        li.textContent = inputText;
        inputList.appendChild(li);
    }

    if (action === 'deleteBtn' && inputText) {
        const items = inputList.getElementsByTagName('li');
        for (let item of items) {
            if (item.textContent === inputText) {
                item.remove();
                break;
            }
        }
    }
    textForm.reset();
});

// Initialize
loadPreferences();
