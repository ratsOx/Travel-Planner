// Initialize Firebase (if not already initialized in a main script)
const firebaseConfig = {
  apiKey: "AIzaSyA0zmc9owO_U3dwIjaXcyZ-_CzCcz3cElI",
  authDomain: "travel-planner-f5671.firebaseapp.com",
  projectId: "travel-planner-f5671",
  storageBucket: "travel-planner-f5671.appspot.com",
  messagingSenderId: "651077817931",
  appId: "1:651077817931:web:1f29ccbf053c6e75359fce",
  measurementId: "G-CY2FNZW3VX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Handle logout
document.getElementById("logoutBtn")?.addEventListener("click", function () {
  // Sign out the user from Firebase
  firebase.auth().signOut().then(() => {
    // Clear any session-related states if you're using them
    localStorage.removeItem("isEmailVerified");
    sessionStorage.removeItem("isEmailVerified");

    // Redirect to the login page after logout
    window.location.href = "login.html";
  }).catch((error) => {
    // Handle logout errors
    console.error("Logout failed: ", error);
  });
});
