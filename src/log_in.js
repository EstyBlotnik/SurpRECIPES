const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const errorMsg = document.getElementById("error-msg");

loginBtn.addEventListener("click", function(event) {
    event.preventDefault();
    
    if (username.value === "" || password.value === "") {
        errorMsg.textContent = "Please enter both username and password";
    } else if (username.value.length < 4 || username.value.length > 20) {
        errorMsg.textContent = "Username must be between 4 and 20 characters";
    } else if (password.value.length < 6 || password.value.length > 20) {
        errorMsg.textContent = "Password must be between 6 and 20 characters";
    } else {
        // Correct username and password
        window.location.href = "dashboard.html";
    }
});