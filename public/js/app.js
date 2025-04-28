document.addEventListener("DOMContentLoaded", function () {
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

  // Cache DOM elements
  const passwordInput = document.getElementById("rPassword");
  const passwordHelp = document.getElementById("passwordHelp");
  const emailInput = document.getElementById("rEmail");
  const emailHelp = document.getElementById("emailHelp");
  const resendBtn = document.getElementById("resendEmailBtn");
  const resendSection = document.getElementById("resendSection");

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|protonmail\.com)$/;

  // Reset the popup on page load
  function resetPopup() {
    const popup = document.getElementById("popupMessage");
    if (popup) {
      popup.classList.add("hidden");
    }
  }

  // Email input validation
  emailInput?.addEventListener("input", function () {
    const email = emailInput.value;
    if (!email) {
      emailHelp.textContent = "";
      emailInput.style.borderColor = "";
      return;
    }
    if (emailPattern.test(email)) {
      emailHelp.style.color = "green";
      emailHelp.textContent = "";
      emailInput.style.borderColor = "green";
    } else {
      emailHelp.style.color = "red";
      emailHelp.textContent = "Must contain '@' and a supported domain";
      emailInput.style.borderColor = "red";
    }
  });

  // Password input validation
  passwordInput?.addEventListener("input", function () {
    const password = passwordInput.value;
    if (!password) {
      passwordHelp.textContent = "";
      passwordInput.style.borderColor = "";
      return;
    }
    if (passwordPattern.test(password)) {
      passwordHelp.style.color = "green";
      passwordHelp.textContent = "";
      passwordInput.style.borderColor = "green";
    } else {
      passwordHelp.style.color = "red";
      passwordHelp.textContent = "Must be 8+ characters with upper, lower, number, and special char";
      passwordInput.style.borderColor = "red";
    }
  });

  // Registration form submit
  document.querySelector("form")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstname = document.getElementById("fName").value;
    const lastname = document.getElementById("lName").value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = document.getElementById("rConfirmPassword").value;

    if (password !== confirmPassword) {
      showPopup("Passwords do not match!");
      return;
    }
    if (!passwordPattern.test(password)) {
      showPopup("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }
    if (!emailPattern.test(email)) {
      showPopup("Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.sendEmailVerification();

      await db.collection("users").doc(user.uid).set({
        email,
        firstname,
        lastname,
        emailVerified: false,
        active: true
      });

      showPopup("Verification email sent! Please check your inbox.");
    } catch (error) {
      showPopup("Error: " + error.message);
      console.error("Signup Error:", error);
    }
  });

  // Google login
  // Google login
async function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // Send email verification if not already verified
    await user.reload(); // Refresh user info
    if (!user.emailVerified) {
      await user.sendEmailVerification();
      showPopup("Google login successful! Verification email sent to your Gmail!");
    } else {
      showPopup("Google login successful! Redirecting...");
    }

    await db.collection("users").doc(user.uid).set({
      email: user.email,
      username: user.displayName
    }, { merge: true });

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2500);  // Added delay to let user see the message
  } catch (error) {
    showPopup("Google login failed: " + error.message);
    console.error("Google login failed:", error);
  }
}


  window.googleLogin = googleLogin;

  // Resend verification email
  resendBtn?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await user.sendEmailVerification();
        showPopup("Verification email resent!");
      } catch (error) {
        showPopup("Error resending email: " + error.message);
      }
    } else {
      showPopup("You must be signed in with an unverified account.");
    }
  });

  // Auth state change listener
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await user.reload();

      // Show resend section only if email is not verified
      if (!user.emailVerified && resendSection) {
        resendSection.classList.remove("hidden");
      } else if (resendSection) {
        resendSection.classList.add("hidden");
      }

      // Show email verification success message and sign out after verification
      if (user.emailVerified) {
        showPopup("Email verified! Redirecting to login page...");
        setTimeout(async () => {
          await auth.signOut(); // Sign out after verification
          window.location.href = "login.html";
        }, 2500);
      }
    }
  });

  // Show popup
  function showPopup(message) {
    const popup = document.getElementById("popupMessage");
    const popupText = document.getElementById("popupText");
    if (popup && popupText) {
      popupText.textContent = message;
      popup.classList.remove("hidden");
    }
  }

  // Close popup and reset the page state
  function closePopup() {
    const popup = document.getElementById("popupMessage");
    if (popup) popup.classList.add("hidden");

    auth.currentUser?.reload().then(() => {
      if (auth.currentUser.emailVerified) {
        auth.signOut().then(() => {
          window.location.href = "login.html";
        });
      }
    });
  }

  window.closePopup = closePopup;

  // Reset popup visibility on page load
  resetPopup();
});

