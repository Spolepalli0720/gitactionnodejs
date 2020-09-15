
import { store } from 'react-notifications-component';

export function notify(title, message) {
    displayNotification(title, message, 'info', 3000);
}

export function notifyWarning(title, message) {
    displayNotification(title, message, 'warning', 4000);
}

export function notifySuccess(title, message) {
    displayNotification(title, message, 'success', 3000);
}

export function notifyError(title, message) {
    if (message === 'Session Expired.  Retry previous action') {
        displayNotification(title, message, 'info', 3000);
    } else {
        displayNotification(title, message, 'danger', 5000);
    }
}

function displayNotification(title, message, type, duration) {
    store.addNotification({
        // title: title,
        message: message,
        type: type,
        insert: "top",
        container: "top-right",
        dismiss: {
            duration: duration,
            onScreen: true,
            pauseOnHover: true
        },
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
    });
}
