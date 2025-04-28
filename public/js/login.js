
    // Firebase config
// Firebase config
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
const auth = firebase.auth();
const db = firebase.firestore();

// Fixed Admin Credentials
const adminEmail = "andrewbasanal@gmail.com";   // 🛡️ CHANGE THIS TO YOUR ADMIN EMAIL
const adminPassword = "andrew@123";              // 🛡️ CHANGE THIS TO YOUR ADMIN PASSWORD

// Login with Email and Password
document.getElementById("submitLogin").addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById("sEmail").value.trim();
  const password = document.getElementById("sPassword").value.trim();

  if (email === "" || password === "") {
    showPopup("⚠️ Please fill in all fields.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        showPopup("📬 Email not verified. We've sent you a verification link!");
        
        try {
          await user.sendEmailVerification();
          console.log("Verification email sent to " + user.email);
        } catch (error) {
          console.error("Error sending verification email:", error);
        }

        auth.signOut(); // Force logout after sending verification email
        return;
      }

      // Check if the logged-in user is the Admin
      if (email === adminEmail) {
        if (password === adminPassword) {
          showPopup("✅ Admin login successful!");
          localStorage.setItem("userId", user.uid);

          // Redirect Admin to Admin Page
          setTimeout(() => {
            window.location.href = "admin.html";  
          }, 1500);
        } else {
          showPopup("❌ Invalid admin credentials.");
          auth.signOut();
        }
      } else {
        // Normal User login
        showPopup("✅ Login successful!");
        localStorage.setItem("userId", user.uid);

        // Redirect User to Dashboard
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);
      }
    })
    .catch((error) => {
      console.error("Login failed:", error);
      showPopup("❌ Login failed: " + error.message);
    });
});

// Google Login
async function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // Store user data in Firestore (merge with existing data if any)
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      username: user.displayName,
    }, { merge: true });

    alert("Google login successful! Redirecting...");
    window.location.href = "dashboard.html";  // Redirect after Google login
  } catch (error) {
    console.error("Google login failed:", error);
    alert("Google login failed: " + error.message);
  }
}

// Popup Message Functions
function showPopup(message) {
  const popup = document.getElementById("popupMessage");
  const popupText = document.getElementById("popupText");

  popupText.textContent = message;
  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popupMessage").classList.add("hidden");
}
