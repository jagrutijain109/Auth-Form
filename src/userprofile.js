import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

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
const auth = getAuth();
const database = getDatabase();
const storage = getStorage();

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        get(ref(database, 'users/' + userId)).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userId = user.uid;

                document.getElementById('profile-name').textContent = userData.fullName;
                document.getElementById('profile-dob').textContent = 'Date of Birth: ' + userData.dob;
                document.getElementById('phone').textContent = 'Phone no: ' + userData.phoneNumber;
                document.getElementById('gender').textContent = 'Gender: ' + userData.gender;
                document.getElementById('address').textContent = 'Address: ' + userData.address;
                document.getElementById('email').textContent = 'Email-id: ' + userData.email;


                getDownloadURL(storageRef(storage, 'profilePhotos/' + userId))
                    .then((url) => {
                        document.getElementById('profile-image').style.backgroundImage = 'url(' + url + ')';
                    })
                    .catch((error) => {
                        console.error('Error getting profile image URL:', error);
                    });

                const qrCode = new QRCode(document.getElementById('qr-code'), {
                    text: `https://firebasestorage.googleapis.com/v0/b/quiq-signup.appspot.com/o/profilePhotos%2F${userId}?alt=media`,
                    width: 150,
                    height: 150
                });

            } else {
                console.log('No data found for user:', userId);
            }
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    } else {
        window.location.href = './index.html';
    }
});
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
// Fetch user data
if (userId) {
    get(ref(database, 'users/' + userId)).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
        } else {
            console.log('No data found for user:', userId);
        }
    }).catch((error) => {
        console.error('Error fetching user data:', error);
    });
}