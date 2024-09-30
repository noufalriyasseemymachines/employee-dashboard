document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById("registration-form");
    const registerUsername = document.getElementById("reg-username");
    const registerPassword = document.getElementById("reg-password");
    const registerCpassword = document.getElementById("reg-cpassword");
    const loginForm = document.getElementById("login-form");
    const loginUsername = document.getElementById("log-username");
    const loginPassword = document.getElementById("log-password");
    const registrationContainer = document.getElementById("registration");
    const loginContainer = document.getElementById("login");
    const gotoLogin = document.getElementById("to-login");
    const gotoRegister = document.getElementById("to-register");

    function showSnackbar(message, type) {
        const snackbar = document.getElementById("snackbar");
        snackbar.textContent = message;
        if (type === "success") {
            snackbar.style.backgroundColor = "#4CAF50";
        } else if (type === "warning") {
            snackbar.style.backgroundColor = "#f44336";
        }
        snackbar.className = "show";
        setTimeout(() => {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    }

    function setCookie(name, value, days){
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        const expires = `expires = ${date.toUTCString()}`
        document.cookie = `${ name }=${ value };${ expires }; path = /`
    }

    function checkLoginStatus() {
        const isLoggedIn = getCookie("isLoggedIn")
        if (isLoggedIn === "true"){
            window.location.href = "index.html"
        }
    }

    function getCookie(name){
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArr = decodedCookie.split(';');
        for (let i = 0; i < cookieArr.length; i++) {
            let cookie = cookieArr[i].trim();
            if (cookie.indexOf(name + "=") == 0) {
                return cookie.substring(name.length + 1);
            }
        }
        return "";
    }

    function loadUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    };

    function saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    };

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = registerUsername.value;
        const password = registerPassword.value;
        const cPassword = registerCpassword.value;

        if (password === cPassword) {
            const users = loadUsers();
            const existingUser = users.find(user => user.username === username);
            if (existingUser){
                showSnackbar("Username already exists.", "warning");
            } else {
                const userData = {
                    username: username,
                    password: password,
                };
                users.push(userData);
                saveUsers(users);
                registrationContainer.style.display = "none";
                loginContainer.style.display = "block";
                showSnackbar("Registration successful! You can log in now.", "success");
            }
        } else {
            showSnackbar("Passwords do not match.", "warning");
        }
    });

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const users = loadUsers();
    const foundUser = users.find(user => user.username === loginUsername.value && user.password === loginPassword.value);
    if (foundUser) {
        setCookie("isLoggedIn", "true", 1)
        localStorage.setItem("isLoginSuccess","true")
        window.location.href = "index.html";
    } else {
        showSnackbar("Incorrect username or password.", "warning");
    }
});

gotoLogin.addEventListener("click", function (e) {
    e.preventDefault();
    registrationContainer.style.display = "none";
    loginContainer.style.display = "block";
});

gotoRegister.addEventListener("click", function (e) {
    e.preventDefault();
    registrationContainer.style.display = "block";
    loginContainer.style.display = "none";
});
checkLoginStatus()
});