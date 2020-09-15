import { subscriptionService } from './studio/services/SubscriptionService';
import { userService } from './studio/services/UserService';
// import { notifyError } from './studio/utils/Notifications';

const firebase = require('firebase/app');
require('firebase/messaging');

firebase.initializeApp({
    apiKey: "AIzaSyCuO_fKlSs6inIAnggnum9pLGy426CwrXQ",
    authDomain: "react-learn-9f044.firebaseapp.com",
    databaseURL: "https://react-learn-9f044.firebaseio.com",
    projectId: "react-learn-9f044",
    storageBucket: "react-learn-9f044.appspot.com",
    messagingSenderId: "594806577996",
    appId: "1:594806577996:web:f993f239a79fdff718cde9",
    measurementId: "G-E4THX5X62L"
});

export const registerFirebaseServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        console.log('Registering Firebase ServiceWorker');
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then(registration => {
            console.log("Registration successful, scope is:", registration.scope);
            setPublicKey();
            setServiceWorker(registration);
            enableRefreshToken();
            enableIncomingMessages();
        }).catch(error => {
            console.log("Service worker registration failed, error:", error.message);
        }).finally(function () {
            console.log('Completed Registering Firebase ServiceWorker');
        });
    }
}

export const ensureMessagingPermission = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const messaging = firebase.messaging();
            await messaging.requestPermission();
            // const currentToken = await messaging.getToken();
            // sendTokenToServer(currentToken);
            // return token;
            fetchToken();
        } catch (error) {
            console.error('ensureMessagingPermission:', error);
        }
    }
}

function setPublicKey() {
    try {
        firebase.messaging().usePublicVapidKey("BNnubd9WnMU7krlof4TGraNzg9on_XErW1ecUt1L9olPSnc6afyd3PLEzN50BGGBNOOhPynsGyUMx78jkPEcigk");
    } catch (error) {
        console.warn('setPublicKey:', error.message);
    }
}

function setServiceWorker(registration) {
    try {
        firebase.messaging().useServiceWorker(registration);
    } catch (error) {
        console.warn('setServiceWorker:', error.message);
    }
}

function enableRefreshToken() {
    // Callback fired if Instance ID token is updated.
    firebase.messaging().onTokenRefresh(() => {
        firebase.messaging().getToken().then(refreshedToken => {
            console.log('Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the app server.
            setTokenSentToServer(false);
            // Send Instance ID token to app server.
            sendTokenToServer(refreshedToken);
        }).catch(error => {
            console.warn('Unable to retrieve refreshed token ', error.message);
        });
    });
}

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.setBackgroundMessageHandler` handler.
function enableIncomingMessages() {
    firebase.messaging().onMessage((payload) => {
        console.log('Message received:', payload);
        appendMessage(payload);
    });
}

function fetchToken() {
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    firebase.messaging().getToken().then(currentToken => {
        if (currentToken) {
            sendTokenToServer(currentToken);
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            setTokenSentToServer(false);
        }
    }).catch(error => {
        console.warn('An error occurred while retrieving token. ', error.message);
        setTokenSentToServer(false);
    });
}

// function deleteToken() {
//     // Delete Instance ID token.
//     firebase.messaging().getToken().then(currentToken => {
//         firebase.messaging().deleteToken(currentToken).then(() => {
//             console.log('Token deleted.');
//             setTokenSentToServer(false);
//         }).catch(deleteTokenError => {
//             console.log('Unable to delete token. ', deleteTokenError.message);
//         });
//     }).catch(fetchTokenError => {
//         console.log('Error retrieving Instance ID token. ', fetchTokenError.message);
//     });
// }

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    showToken(currentToken);
    //TODO Later :: Enable verification of isTokenSentToServer
    // if (!isTokenSentToServer()) {
        subscriptionService.registerSubscription(currentToken).then(response => {
            setTokenSentToServer(true);
        }).catch(error => {
            setTokenSentToServer(false);
            console.error('subscriptionService.registerSubscription:', error);
            // notifyError('Unable to retrieve for subscriptions', error.message);
        });
    // }
}

function showToken(currentToken) {
    console.log('currentToken:', currentToken);
}

// function isTokenSentToServer() {
//     return window.localStorage.getItem('firebaseTokenSync') === '1';
// }

function setTokenSentToServer(sent) {
    window.localStorage.setItem('firebaseTokenSync', sent ? '1' : '0');
}

function appendMessage(payload) {
    let firebaseMessages = JSON.parse(localStorage.getItem('firebaseMessages'));
    payload.receivedAt = new Date().toISOString();
    if(firebaseMessages) {
        firebaseMessages.unshift(payload);
    } else {
        firebaseMessages = [ payload ]
    }
    localStorage.setItem("firebaseMessages", JSON.stringify(firebaseMessages))
    localStorage.setItem('firebaseMsgUnread', '1');
    if (userService.isAuthenticated()) {
        document.dispatchEvent(new CustomEvent('firebaseMessageReceived', { detail: { message: payload }}));
        // makeSound();
    }
}

// const msgSound = new Audio("data:audio/wav;base64,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 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
// function makeSound() {
//     msgSound.play();
// }

// Clear the messages element of all children.
// function clearMessages() {
//     console.log('clearMessages');
//     localStorage.setItem('firebaseMessages', [])
//     // const messagesElement = document.querySelector('#messages');
//     // while (messagesElement.hasChildNodes()) {
//     //     messagesElement.removeChild(messagesElement.lastChild);
//     // }
// }
