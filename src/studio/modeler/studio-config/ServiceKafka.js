module.exports.KAFKA = {
    label_path: 'Action',
    label_method: 'Operation',
    hideVersion: true,
    path: {
        path: '{KAFKA_CONFIG}',
        methods: [
            
            { value: 'send/{host}:{port}/{topicName}/{client.id}/{acks}/{payload}', name: 'Send Message'},
            { value: 'recieve/{host}:{port}/{topicName}/{client.id}/{acks}', name: 'Listen Messages'}
        ]
    }
}