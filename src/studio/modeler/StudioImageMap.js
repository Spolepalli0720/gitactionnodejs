import StudioImages from './StudioImages'

export function getImage(key) {
    if (ImageMap[key]) {
        return ImageMap[key];
    } else {
        return require('../../assets/studio/images/logo.png');
    }
}

const ImageMap = {
    // DataStore
    'Cassandra': StudioImages.CASSANDRA,
    'DynamoDB': StudioImages.DYNAMO,
    'ElasticDB': StudioImages.ELASTIC,
    'Hadoop': StudioImages.HADOOP,
    'HiveSQL': StudioImages.HIVE,
    'MariaDB': StudioImages.MARIADB,
    'MongoDB': StudioImages.MONGODB,
    'MySQL': StudioImages.MYSQL,
    'ObjectDB': StudioImages.OBJSTORE,
    'OracleDB': StudioImages.ORACLE,
    'PostgreSQL': StudioImages.POSTGRESQL,
    'RedisDB': StudioImages.REDIS,
    'RedshiftDB': StudioImages.REDSHIFT,
    'SAP_HANA': StudioImages.SAP_HANA,
    'SQLServer': StudioImages.SQLSERVER,

    // Built-IN Connector ( Temporary )
    'http-connector': StudioImages.HTTP_CONNECTOR,
    'mail-poll': StudioImages.MAIL_POLL,
    'mail-send': StudioImages.MAIL_SEND,


    // API Connector
    'HTTP': StudioImages.HTTP,
    'REST': StudioImages.REST,
    'SOAP': StudioImages.SOAP,

    // E-Commerce
    'Magento': StudioImages.MAGENTO,
    'PrestaShop': StudioImages.PRESTASHOP,
    'Shopify': StudioImages.SHOPIFY,
    'WooCommerce': StudioImages.WOOCOMMERCE,

    // CRM
    'HubSpot': StudioImages.HUBSPOT,
    'NetSuite': StudioImages.NETSUITE,
    'NetSuite-SOAP': StudioImages.NETSUITE,
    'Salesforce': StudioImages.SALESFORCE,
    'Salesforce-SOAP': StudioImages.SALESFORCE,
    'Zendesk': StudioImages.ZENDESK,
    'Zoho': StudioImages.ZOHO,

    // Content Management
    'Box': StudioImages.BOX,
    'Dropbox': StudioImages.DROPBOX,
    'SharePoint': StudioImages.SHAREPOINT,
    'FileServer': StudioImages.FILE,
    'FtpServer': StudioImages.FTP,

    // Other Tools and Systems
    'Marketo': StudioImages.MARKETO,
    'ServiceNow': StudioImages.SERVICENOW,
    'Workday': StudioImages.WORKDAY,

    'Authentication': StudioImages.AUTH,

    // Machine Learning
    'ArtificialIntelligence': StudioImages.INTELLIGENCE,
    'NeuralNetwork': StudioImages.NEURAL,
    'DeepLearning': StudioImages.DEEP_LEARNING,

    // Edge Devices
    'Sensor': StudioImages.SENSOR,

    // Users
    'AdminUser': StudioImages.USER_ADMIN,
    'BusinessUser': StudioImages.USER_BUSINESS,
    'SupportUser': StudioImages.USER_SUPPORT,

    // Cloud
    'AWSCloud': StudioImages.AWS_CLOUD,
    'AzureCloud': StudioImages.AZURE_CLOUD,
    'GoogleCloud': StudioImages.GOOGLE_CLOUD,

    // Social
    'Email': StudioImages.EMAIL,
    'Slack': StudioImages.SLACK,
    'Twillio': StudioImages.TWILLIO,
    'Facebook': StudioImages.FACEBOOK,
    'Instagram': StudioImages.INSTAGRAM,
    'LinkedIn': StudioImages.LINKEDIN,
    'Twitter': StudioImages.TWITTER,

    // Messaging
    'AMQP': StudioImages.AMQP,
    'Kafka': StudioImages.KAFKA,
    'MQ_IBM': StudioImages.MQIBM,
    'MQTT': StudioImages.MQTT,
    'JMS': StudioImages.JMS,

    // Scrapers
    'Amazon': StudioImages.AMAZON,
    'Walmart': StudioImages.WALMART,
    'BestBuy': StudioImages.BESTBUY,
    'Samsung': StudioImages.SAMSUNG,
    // 'Instagram': StudioImages.INSTAGRAM,
    // 'Twitter': StudioImages.TWITTER,
    // 'Facebook': StudioImages.FACEBOOK,








    // TODO :: Deprecated :: to be removed 

    'ZoomIN': StudioImages.ZOOM_IN,
    'ZoomOUT': StudioImages.ZOOM_OUT,
    'ZoomFIT': StudioImages.ZOOM_FIT,

    'DiagramSYNC': StudioImages.SYNC,
    'WebserviceTask': StudioImages.WEBSERVICE,
    'ToggleON': StudioImages.TOGGLE_ON,
    'ToggleOFF': StudioImages.TOGGLE_OFF,
    'UserAdmin': StudioImages.USER_ADMIN,
    'UserBusiness': StudioImages.USER_BUSINESS,
    'UserSupport': StudioImages.USER_SUPPORT,
    'HttpTask': StudioImages.HTTP,
    'AuthTask': StudioImages.AUTH,
    'MagentoTask': StudioImages.MAGENTO,
    'ShopifyTask': StudioImages.SHOPIFY,
    'WoocommerceTask': StudioImages.WOOCOMMERCE,
    'MarketoTask': StudioImages.MARKETO,
    'HubSpotTask': StudioImages.HUBSPOT,
    'NetSuiteTask': StudioImages.NETSUITE,
    'SalesforceTask': StudioImages.SALESFORCE,
    'ServiceNowTask': StudioImages.SERVICENOW,
    'WorkdayTask': StudioImages.WORKDAY,
    'ZendeskTask': StudioImages.ZENDESK,
    'ZohoTask': StudioImages.ZOHO,
    'BoxTask': StudioImages.BOX,
    'DropboxTask': StudioImages.DROPBOX,
    'SharePointTask': StudioImages.SHAREPOINT,
    'FileTask': StudioImages.FILE,
    'FtpTask': StudioImages.FTP,
    'EmailTask': StudioImages.EMAIL,
    'IntelligenceTask': StudioImages.INTELLIGENCE,
    'NeuralTask': StudioImages.NEURAL,
    'DeepLearningTask': StudioImages.DEEP_LEARNING,
    'SensorTask': StudioImages.SENSOR,
    'AWSCloudTask': StudioImages.AWS_CLOUD,
    'AzureCloudTask': StudioImages.AZURE_CLOUD,
    'GoogleCloudTask': StudioImages.GOOGLE_CLOUD,
    'SlackTask': StudioImages.SLACK,
    'TwillioTask': StudioImages.TWILLIO,
    'FacebookTask': StudioImages.FACEBOOK,
    'InstagramTask': StudioImages.INSTAGRAM,
    'LinkedInTask': StudioImages.LINKEDIN,
    'TwitterTask': StudioImages.TWITTER,
    'AMQPTask': StudioImages.AMQP,
    'KafkaTask': StudioImages.KAFKA,
    'MQIBMTask': StudioImages.MQIBM,
    'MQTTTask': StudioImages.MQTT,
    'JMSTask': StudioImages.JMS,
    'CassandraDB': StudioImages.CASSANDRA,
    'HadoopDB': StudioImages.HADOOP,

}
