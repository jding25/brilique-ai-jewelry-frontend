<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAVuyDg3JuEeYPesCdQubz0gNQPH6U9KU0",
    authDomain: "brilique-3ae3b.firebaseapp.com",
    projectId: "brilique-3ae3b",
    storageBucket: "brilique-3ae3b.firebasestorage.app",
    messagingSenderId: "622180990908",
    appId: "1:622180990908:web:65204b3249eedf13b475b9",
    measurementId: "G-QMS5PFKFWG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>