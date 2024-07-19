import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbh-IeJ-WDPiiZDkKRhWkJM7ezZfPyhIM",
    authDomain: "quiq-signup.firebaseapp.com",
    projectId: "quiq-signup",
    storageBucket: "quiq-signup.appspot.com",
    messagingSenderId: "1061339450478",
    appId: "1:1061339450478:web:6c7fe4bc57754c8592aa7f",
    measurementId: "G-ZCSZNQC12K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth();
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const google = document.getElementById("google-login");
const googlelogin = document.getElementById("google-login1")

google.addEventListener("click", function () {
    signInWithPopup(auth, provider)
        .then((result) => {

            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);

            const userRef = ref(database, 'users/' + user.uid);
            set(userRef, {
                fullName: user.displayName,
                email: user.email,
                profilePhoto: user.photoURL,
            }).then(() => {

                window.location.href = "./profile.html";
            }).catch((error) => {
                console.error("Error saving user data:", error);
            });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error("Error during Google sign-in:", error);
        });
})

googlelogin.addEventListener("click", function () {
    signInWithPopup(auth, provider)
        .then((result) => {

            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;

            console.log(user);

            const userRef = ref(database, 'users/' + user.uid);
            set(userRef, {
                fullName: user.displayName,
                email: user.email,
                profilePhoto: user.photoURL,

            }).then(() => {

                window.location.href = "./profile.html";
            }).catch((error) => {
                console.error("Error saving user data:", error);
            });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error("Error during Google sign-in:", error);
        });

})

document.getElementById('signup').addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Sign up button clicked");

    const fullName = document.getElementById('username').value;
    const phoneNumber = document.getElementById('userphone').value;
    const email = document.getElementById('useremail').value;
    const password = document.getElementById('userpassword').value;
    const profilePhoto = document.getElementById('userprofilephoto').files[0];
    const coverPhoto = document.getElementById('usercoverphoto').files[0];
    const dob = document.getElementById('userdob').value;
    const gender = document.getElementById('usergender').value;
    const address = document.getElementById('useraddress').value;

    if (fullName === "" || phoneNumber === "" || email === "" || password === "" || profilePhoto === undefined || coverPhoto === undefined || dob === "" || gender === "" || address === "") {
        alert("Please fill in all required fields.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;

            const profilePhotoRef = storageRef(storage, 'profilePhotos/' + userId);
            const coverPhotoRef = storageRef(storage, 'coverPhotos/' + userId);

            uploadBytes(profilePhotoRef, profilePhoto).then((snapshot) => {
                console.log('Profile photo uploaded');
            }).catch((error) => {
                console.error('Error uploading profile photo:', error);
            });

            uploadBytes(coverPhotoRef, coverPhoto).then((snapshot) => {
                console.log('Cover photo uploaded');
            }).catch((error) => {
                console.error('Error uploading cover photo:', error);
            });

            set(ref(database, 'users/' + userId), {
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                dob: dob,
                gender: gender,
                address: address
            }).then(() => {
                alert("User Created Successfully");
                window.location.href = './profile.html';
            }).catch((error) => {
                console.error('Error saving user data:', error);
            });
        })
        .catch((error) => {
            console.error("Error creating user:", error);
            alert(error.message);
        });
});


document.getElementById('login').addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Login button clicked");

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    console.log("Email:", email);
    console.log("Password:", password);

    if (email === "" || password === "") {
        alert("Please fill in both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed in with email and password");
            window.location.href = './profile.html';
            const user = userCredential.user;
            const dt = new Date();
            update(ref(database, 'users/' + user.uid), {
                last_login: dt,
            }).then(() => {
                alert("User Logged In!");
                console.log("User login time updated in database");
            }).catch((error) => {
                console.error("Error updating user login time in database:", error);
                alert(error.message);
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in user:", errorCode, errorMessage);
            alert(errorMessage);
        });
});