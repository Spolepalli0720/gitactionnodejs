module.exports.AMQP = {
    label_path: 'Action',
    label_method: 'Operation',
    hideVersion: true,
    path: {
        path: '{AMQP_CONFIG}',
        methods: [
            
            { value: 'send/{host}:{port}/{queueName}/{exchange}/{client.id}/{acks}/{payload}', name: 'Send Message'}
          
        ]
    }
}