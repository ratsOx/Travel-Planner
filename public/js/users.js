
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyA0zmc9owO_U3dwIjaXcyZ-_CzCcz3cElI",
      authDomain: "travel-planner-f5671.firebaseapp.com",
      projectId: "travel-planner-f5671",
      storageBucket: "travel-planner-f5671.appspot.com",
      messagingSenderId: "651077817931",
      appId: "1:651077817931:web:1f29ccbf053c6e75359fce",
      measurementId: "G-CY2FNZW3VX"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();

    const usersContainer = document.querySelector('.users');

    // Function to render a single user
    function renderUser(doc) {
  const user = doc.data();

  const userDiv = document.createElement('div');
  userDiv.classList.add('user_one');

  userDiv.innerHTML = `
    <label>${user.firstname}</label>
    <label>${user.lastname}</label>
    <label>${user.email}</label>
    <label>${user.active ? 'Active' : 'Inactive'}</label>
    <div>
      <button class="delete_user" data-id="${doc.id}" title="Delete User"><img src="images/bin.png"></button>
      <label class="switch">
        <input type="checkbox" class="deactivate_user" data-id="${doc.id}" ${user.active ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
  `;

  usersContainer.appendChild(userDiv);
}


    // Listen for auth state
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("User is logged in:", user.email);

        // Fetch users from Firestore
        db.collection('users').onSnapshot(snapshot => {
          usersContainer.innerHTML = ''; // clear the container first
          snapshot.forEach(doc => {
            renderUser(doc);
          });
        });

      } else {
        console.log("User is not logged in");
        // Redirect to login or show error
        window.location.href = "login.html"; // or your login page
      }
    });

    // Handle deactivate and delete actions
    usersContainer.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');

      if (e.target.classList.contains('delete_user')) {
        if (confirm("Are you sure you want to delete this user?")) {
          db.collection('users').doc(id).delete()
            .then(() => console.log("User deleted"))
            .catch(err => console.error("Error deleting user: ", err));
        }
      }

      if (e.target.classList.contains('deactivate_user')) {
        const isActive = e.target.checked;
        db.collection('users').doc(id).update({
          active: isActive
        })
        .then(() => console.log(`User ${isActive ? 'activated' : 'deactivated'}`))
        .catch(err => console.error("Error updating user: ", err));
      }
    });
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