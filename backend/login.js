  document.querySelector("#loginButton").addEventListener("click", async function (e) {
      e.preventDefault(); 

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      if (!email || !password) {
          alert("Please enter both email and password.");
          return;
      }

      try {
          //const response = await fetch('http://3.83.241.175:8080/login', {
          const response = await fetch('http://localhost:8080/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });

          const result = await response.json();
          console.log("Server response:", result); 

          if (response.ok) {
              if (result.token) {
                  console.log("Token received:", result.token);  // Logging token for debugging
                  localStorage.setItem("token", result.token); 
                  window.location.href = "dashboard.html"; 
              } else {
                  console.error("No token received");
                  alert("Error: No token received from the server.");
              }
          } else {
              alert("Error: " + result.error);
          }
      } catch (error) {
          console.error("Login error:", error);
          alert("Login failed! Please try again.");
      }
  });
