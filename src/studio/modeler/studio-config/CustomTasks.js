// Valid value for type: UserTask, DataObject, DataStore, ServiceTask
module.exports.WORKFLOW_TASKS = [
    // DataStore
    { type: 'DataStore', group: 'data-store', name: 'Cassandra', image: 'Cassandra' },
    { type: 'DataStore', group: 'data-store', name: 'DynamoDB', image: 'DynamoDB' },
    { type: 'DataStore', group: 'data-store', name: 'ElasticDB', image: 'ElasticDB' },
    { type: 'DataStore', group: 'data-store', name: 'HiveSQL', image: 'HiveSQL' },
    { type: 'DataStore', group: 'data-store', name: 'MariaDB', image: 'MariaDB' },
    { type: 'DataStore', group: 'data-store', name: 'MongoDB', image: 'MongoDB' },
    { type: 'DataStore', group: 'data-store', name: 'MySQL', image: 'MySQL' },
    { type: 'DataStore', group: 'data-store', name: 'OracleDB', image: 'OracleDB' },
    { type: 'DataStore', group: 'data-store', name: 'PostgreSQL', image: 'PostgreSQL' },
    { type: 'DataStore', group: 'data-store', name: 'RedisDB', image: 'RedisDB' },
    { type: 'DataStore', group: 'data-store', name: 'RedshiftDB', image: 'RedshiftDB' },
    { type: 'DataStore', group: 'data-store', name: 'SAP HANA', image: 'SAP_HANA' },
    { type: 'DataStore', group: 'data-store', name: 'SQL Server', image: 'SQLServer' },

    // Built-IN Connector ( Temporary )
    // { type: 'ServiceTask', group: 'connectors', name: 'HTTP Connector'  , image: 'http-connector' },
    // { type: 'ServiceTask', group: 'connectors', name: 'Poll Email'  , image: 'mail-poll' },
    // { type: 'ServiceTask', group: 'connectors', name: 'Send Email'  , image: 'mail-send' },

    // API Connector
    { type: 'ServiceTask', group: 'connectors', name: 'HTTP Service', image: 'HTTP' },
    { type: 'ServiceTask', group: 'connectors', name: 'REST Service', image: 'REST' },
    { type: 'ServiceTask', group: 'connectors', name: 'SOAP Service', image: 'SOAP' },

    // E-Commerce
    { type: 'ServiceTask', group: 'connectors', name: 'Magento', implType: 'REST', image: 'Magento' },
    { type: 'ServiceTask', group: 'connectors', name: 'PrestaShop', implType: 'REST', image: 'PrestaShop' },
    { type: 'ServiceTask', group: 'connectors', name: 'Shopify', implType: 'REST', image: 'Shopify' },
    { type: 'ServiceTask', group: 'connectors', name: 'WooCommerce', implType: 'REST', image: 'WooCommerce' },

    // CRM
    { type: 'ServiceTask', group: 'connectors', name: 'Hubspot', implType: 'REST', image: 'HubSpot' },
    { type: 'ServiceTask', group: 'connectors', name: 'NetSuite', implType: 'SOAP', image: 'NetSuite-SOAP' },
    { type: 'ServiceTask', group: 'connectors', name: 'Salesforce', implType: 'SOAP', image: 'Salesforce-SOAP' },
    { type: 'ServiceTask', group: 'connectors', name: 'Zendesk', implType: 'REST', image: 'Zendesk' },
    { type: 'ServiceTask', group: 'connectors', name: 'Zoho', implType: 'REST', image: 'Zoho' },

    // Content Management
    { type: 'ServiceTask', group: 'connectors', name: 'Box', implType: 'REST', image: 'Box' },
    { type: 'ServiceTask', group: 'connectors', name: 'Dropbox', implType: 'REST', image: 'Dropbox' },
    { type: 'ServiceTask', group: 'connectors', name: 'Sharepoint', implType: 'REST', image: 'SharePoint' },
    { type: 'ServiceTask', group: 'connectors', name: 'File Server', implType: 'REST', image: 'FileServer' },
    { type: 'ServiceTask', group: 'connectors', name: 'Ftp Server', implType: 'REST', image: 'FtpServer' },

    // Others
    { type: 'ServiceTask', group: 'connectors', name: 'Marketo', implType: 'REST', image: 'Marketo' },
    { type: 'ServiceTask', group: 'connectors', name: 'ServiceNow', implType: 'REST', image: 'ServiceNow' },
    { type: 'ServiceTask', group: 'connectors', name: 'Workday', implType: 'REST', image: 'Workday' },

    // Authentication
    { type: 'ServiceTask', group: 'connectors', name: 'Authentication', implType: 'REST', image: 'Authentication' },

    // Scrapers
    { type: 'ServiceTask', group: 'scrapers', name: 'Amazon Scraper', implType: 'REST', image: 'Amazon' },
    { type: 'ServiceTask', group: 'scrapers', name: 'Walmart Scraper', implType: 'REST', image: 'Walmart' },
    { type: 'ServiceTask', group: 'scrapers', name: 'BestBuy Scraper', implType: 'REST', image: 'BestBuy' },
    { type: 'ServiceTask', group: 'scrapers', name: 'Samsung Scraper', implType: 'REST', image: 'Samsung' },
    { type: 'ServiceTask', group: 'scrapers', name: 'Instagram Scraper', implType: 'REST', image: 'Instagram' },
    { type: 'ServiceTask', group: 'scrapers', name: 'Twitter Scraper', implType: 'REST', image: 'Twitter' },
    { type: 'ServiceTask', group: 'scrapers', name: 'Facebook Scraper', implType: 'REST', image: 'Facebook' },

    // Machine Learning
    { type: 'ServiceTask', group: 'models', name: 'Artificial Intelligence', implType: 'REST', image: 'ArtificialIntelligence' },
    { type: 'ServiceTask', group: 'models', name: 'Neural Network', implType: 'REST', image: 'NeuralNetwork' },
    { type: 'ServiceTask', group: 'models', name: 'Deep Learning', implType: 'REST', image: 'DeepLearning' },

    // Edge Devices
    { type: 'DataStore', group: 'sensors', name: 'Sensor', image: 'Sensor' },

    // Cloud
    { type: 'ServiceTask', group: 'cloud', name: 'AWS Cloud', implType: 'REST', image: 'AWSCloud' },
    { type: 'ServiceTask', group: 'cloud', name: 'Azure Cloud', implType: 'REST', image: 'AzureCloud' },
    { type: 'ServiceTask', group: 'cloud', name: 'Google Cloud', implType: 'REST', image: 'GoogleCloud' },

    // Social
    { type: 'ServiceTask', group: 'social', name: 'EMail', image: 'Email' },
    { type: 'ServiceTask', group: 'social', name: 'Slack', image: 'Slack' },
    { type: 'ServiceTask', group: 'social', name: 'Twillio', image: 'Twillio' },
    { type: 'ServiceTask', group: 'social', name: 'Facebook', image: 'Facebook' },
    { type: 'ServiceTask', group: 'social', name: 'Instagram', image: 'Instagram' },
    { type: 'ServiceTask', group: 'social', name: 'LinkedIn', image: 'LinkedIn' },
    { type: 'ServiceTask', group: 'social', name: 'Twitter', image: 'Twitter' },

    // Messaging
    { type: 'ServiceTask', group: 'messaging', name: 'AMQP', image: 'AMQP' },
    { type: 'ServiceTask', group: 'messaging', name: 'Kafka', image: 'Kafka' },
    { type: 'ServiceTask', group: 'messaging', name: 'IBM MQ', image: 'MQ_IBM' },
    { type: 'ServiceTask', group: 'messaging', name: 'MQTT', image: 'MQTT' },
    { type: 'ServiceTask', group: 'messaging', name: 'JMS', image: 'JMS' },

    // Users
    { type: 'UserTask', group: 'users', name: 'Admin User', image: 'AdminUser' },
    { type: 'UserTask', group: 'users', name: 'Business User', image: 'BusinessUser' },
    { type: 'UserTask', group: 'users', name: 'Support User', image: 'SupportUser' },

];

module.exports.RULEFLOW_TASKS = [];
