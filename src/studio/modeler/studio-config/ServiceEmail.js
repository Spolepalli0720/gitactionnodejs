// Mail Connector ( Temporary )
module.exports.MAIL_POLL = {
    label_path: 'Action',
    label_method: 'Operation',
    hideVersion: true,
    path: {
        value: '{EMAIL_CONFIG}',
        methods: [
            { value: 'poll/{folder}', name: 'Poll Messages'},
        ]
    }
}
// Mail Connector ( Temporary )
module.exports.MAIL_SEND = {
    label_path: 'Action',
    label_method: 'Operation',
    hideVersion: true,
    path: {
        value: '{EMAIL_CONFIG}',
        methods: [
            { value: 'send/{from}/{to}/{subject}/{text:text}', name: 'Send Email'},
        ]
    }
}
module.exports.EMAIL = {
    label_path: 'Action',
    label_method: 'Operation',
    hideVersion: true,
    path: {
        value: '{EMAIL_CONFIG}',
        methods: [
            { value: 'poll/{folder}', name: 'Poll Messages'},
            { value: 'send/{to}/{subject}/{message:message}', name: 'Send Email'},
            { value: 'delete/{folder}/{mails:mails}', name: 'Delete Messages'}
        ]
    }
}