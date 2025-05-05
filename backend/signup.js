document.getElementById('signupBtn').addEventListener('click', function(event) {
    event.preventDefault();

    //form input values
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // all fields are filled
    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
    }

    const signupData = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    //fetch('http://3.83.241.175/:8080/signup', {
    fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
    })
        .then(response => response.json())
        .then(data => {
        if (data.message === "User created successfully") {
            window.location.href = "login.html";
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
