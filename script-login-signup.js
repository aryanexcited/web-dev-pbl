/* ===== TOGGLE PASSWORD ===== */
function togglePassword(id) {
    let input = document.getElementById(id);
    input.type = (input.type === "password") ? "text" : "password";
}

/* ================= LOGIN ================= */
let loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let role = document.querySelector('input[name="role"]:checked');
        let user = document.getElementById("username").value.trim();
        let pass = document.getElementById("password").value.trim();
        let msg = document.getElementById("loginMsg");

        if (!role) {
            msg.style.color = "red";
            msg.innerText = "Please select a role!";
            return;
        }

        if (user === "" || pass === "") {
            msg.style.color = "red";
            msg.innerText = "All fields are required!";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let found = users.find(u =>
            u.username === user &&
            u.password === pass &&
            u.role === role.value
        );

        if (!found) {
            msg.style.color = "red";
            msg.innerText = "Invalid credentials!";
            return;
        }

        /* ===== SAVE SESSION ===== */
        localStorage.setItem("userRole", found.role);
        localStorage.setItem("username", found.username);

        msg.style.color = "lightgreen";
        msg.innerText = "Login successful!";

        /* ===== REDIRECT TO MAIN PAGE ===== */
        setTimeout(() => {
            window.location.href = "main-page.html";
        }, 800);
    });
}

/* ================= SIGNUP ================= */
let signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let role = document.querySelector('input[name="role"]:checked');
        let user = document.getElementById("newUser").value.trim();
        let pass = document.getElementById("newPass").value.trim();
        let confirm = document.getElementById("confirmPass").value.trim();
        let msg = document.getElementById("signupMsg");

        if (!role || user === "" || pass === "" || confirm === "") {
            msg.style.color = "red";
            msg.innerText = "All fields are required!";
            return;
        }

        if (pass.length < 4) {
            msg.style.color = "red";
            msg.innerText = "Password must be at least 4 characters!";
            return;
        }

        if (pass !== confirm) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match!";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        /* ===== PREVENT DUPLICATE USERS ===== */
        let exists = users.find(u => u.username === user);

        if (exists) {
            msg.style.color = "red";
            msg.innerText = "Username already exists!";
            return;
        }

        /* ===== SAVE USER ===== */
        users.push({
            username: user,
            password: pass,
            role: role.value
        });

        localStorage.setItem("users", JSON.stringify(users));

        msg.style.color = "lightgreen";
        msg.innerText = "Account created successfully!";
    });
}

/* ================= ACCESS CONTROL ================= */
function checkAccess(allowedRoles) {
    let role = localStorage.getItem("userRole");

    if (!role) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    /* ===== SUPPORT MULTIPLE ROLES ===== */
    if (!allowedRoles.includes(role)) {
        alert("Access Denied!");
        window.location.href = "login.html";
    }
}

/* ================= SHOW USER INFO ================= */
function showUser() {
    let user = localStorage.getItem("username");
    let role = localStorage.getItem("userRole");

    let el = document.getElementById("userInfo");

    if (el) {
        el.innerText = "Logged in as: " + user + " (" + role + ")";
    }
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}