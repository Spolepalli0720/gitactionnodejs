function capitalize(text) {
    const splitText = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return splitText;
}

function uniqueKeyGenerator(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (var i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
}

function getBadgeClassName(status) {
    switch (status.toLowerCase()) {
        case 'draft':
            return 'badge-warning';
        case 'done':
            return 'badge-success';
        case 'cancel':
            return 'badge-danger';
        default:
            return 'badge-primary';
    }
}

function getTextClassName(status) {
    switch (status.toLowerCase()) {
        case 'purchase':
            return 'text-primary';
        case 'draft':
            return 'text-warning';
        case 'done':
            return 'text-success';
        case 'cancel':
            return 'text-danger';
        default:
            return 'text-default';
    }
}

function getCurrencySymbol(curr) {
    switch (curr) {
        case 'EUR':
            return '€';
        case 'USD':
            return '$';
        case 'INR':
            return '₹';
        default:
            return '';
    }
}

function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
        case 'urgent':
            return 'badge-danger';
        case 'low':
            return 'badge-success';

        default:
            return 'badge-primary';
    }
}

export default {
    capitalize,
    uniqueKeyGenerator,
    getBadgeClassName,
    getTextClassName,
    getPriorityClass,
    getCurrencySymbol
}