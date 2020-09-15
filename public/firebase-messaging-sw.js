// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyCuO_fKlSs6inIAnggnum9pLGy426CwrXQ",
    authDomain: "react-learn-9f044.firebaseapp.com",
    databaseURL: "https://react-learn-9f044.firebaseio.com",
    projectId: "react-learn-9f044",
    storageBucket: "react-learn-9f044.appspot.com",
    messagingSenderId: "594806577996",
    appId: "1:594806577996:web:f993f239a79fdff718cde9",
    measurementId: "G-E4THX5X62L"
};

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/favicon.ico'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// messaging.setBackgroundMessageHandler(function (payload) {
//     const promiseChain = clients
//         .matchAll({
//             type: "window",
//             includeUncontrolled: true
//         })
//         .then(windowClients => {
//             for (let i = 0; i < windowClients.length; i++) {
//                 const windowClient = windowClients[i];
//                 windowClient.postMessage(payload);
//             }
//         })
//         .then(() => {
//             return registration.showNotification("my notification title");
//         });
//     return promiseChain;
// });

self.addEventListener('notificationclick', function (event) {
    console.log(event)
});