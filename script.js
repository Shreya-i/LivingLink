
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2UAXf3VLYfGKM4z4m6B0rdpdREay_2LA",
  authDomain: "livinglink-dc4e2.firebaseapp.com",
  projectId: "livinglink-dc4e2",
  storageBucket: "livinglink-dc4e2.appspot.com",
  messagingSenderId: "191032692351",
  appId: "1:191032692351:web:3cd585ec07c3257700394a"
};
// Initialize Fi    rebase app and get reference to database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("submit").addEventListener('click', function(e){
  e.preventDefault();  // Prevent default form submission
  
  // Get user input values
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  // Validate user inputs (optional but recommended)
  if (!username || !email || !phone) {
      alert("Please fill all the fields");
      return;
  }

  // Reference to the database path where data will be saved
  const userRef = ref(db, 'user/' + username);

  // Set data in Firebase database
  set(userRef, {
      username: username,
      email: email,
      phoneNumber: phone
  })
  .then(() => {
      // If data is added successfully, alert the user
      alert("Login Successful!");

      // Redirect to the next page (replace 'nextpage.html' with your actual file)
      window.location.href = "home.html";
  })
  .catch((error) => {
      // Handle any errors during the Firebase operation
      console.error("Error adding data:", error);
      alert("Failed to add data: " + error.message);
  });
});
