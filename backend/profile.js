// Function to get user data
async function getUserData() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user data');
    
    const user = await response.json();

    if (user && user.userid) {
      localStorage.setItem('userID', user.userid);
    } else {
      console.error('User ID is missing from the response', user);
    }

    document.getElementById("user-name").textContent = user.username || "Unknown User";
    document.getElementById("user-email").textContent = user.email || "user@example.com";

    if (user.bio) {
      document.getElementById("bio").value = user.bio;
    }

    if (user.profilePicUrl) {
      const previewImg = document.getElementById("profilePreview");
      previewImg.src = user.profilePicUrl;
      previewImg.style.display = 'block';
    }

    const joinResponse = await fetch(`http://localhost:8080/users/${user.userid}`);
    const joinData = await joinResponse.json();

    if (joinData && joinData.PasswordDate) {
      const formattedDate = new Date(joinData.PasswordDate).toLocaleDateString(); 
      document.getElementById("join-date").textContent = formattedDate || "Unknown Date";
    } else {
      console.error('Join Date is missing or undefined in the response');
      document.getElementById("join-date").textContent = "Unknown Date"; 
    }

  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

  const photoInput = document.getElementById('photo');
  const previewImg = document.getElementById('profilePreview');

  photoInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.src = '';
      previewImg.style.display = 'none';
    }
  });

  document.getElementById('saveProfileBtn').addEventListener('click', async function(event) {
event.preventDefault();

const bio = document.getElementById('bio').value;
const photoFile = photoInput.files[0];  

if (!bio && !photoFile) {
  alert("Please enter your bio or upload a profile picture.");
  return;
}

const profileData = {
  bio: bio || null,  
  profilePicUrl: photoFile ? await getBase64(photoFile) : null  
};

const token = localStorage.getItem('token');
try {
  const response = await fetch("http://localhost:8080/profile/update", {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });

  const result = await response.json();
  console.log("Server response:", result);

  if (response.ok) {
    alert("Profile saved successfully!");
  } else {
    alert("Error: " + result.error);
  }
} catch (error) {
  console.error("Error:", error);
  alert("An error occurred. Please try again.");
}
});

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  window.onload = function() {
    getUserData();
  };
