var CustomTasks = require('./studio-config/CustomTasks'),
    DataStore = require('./studio-config/DataStore'),
    ServiceMagento = require('./studio-config/ServiceMagento'),
    ServiceShopify = require('./studio-config/ServiceShopify'),
    ServiceNetSuite = require('./studio-config/ServiceNetSuite'),
    ServiceEmail = require('./studio-config/ServiceEmail'),
    ServiceAmqp = require('./studio-config/ServiceAmqp'),
    ServiceKafka = require('./studio-config/ServiceKafka'),
    ServiceDeepLearning = require('./studio-config/ServiceDeepLearning');

module.exports.WORKFLOW_TASKS = CustomTasks.WORKFLOW_TASKS;

module.exports.RULEFLOW_TASKS = CustomTasks.RULEFLOW_TASKS;

module.exports.DATABASE_CONNECTOR = DataStore.DATABASE_CONNECTOR;

//Values are populated via Service call
module.exports.INPUT_FORMS = [];

//Values are populated via Service call
module.exports.CALLABLE_RULES = [];

//Values are populated via Service call
module.exports.CALLABLE_TASKS = [];

//Values are populated via Service call
module.exports.CALLABLE_CASES = [];

//Values are populated via Service call
module.exports.CONNECTOR_CONFIG = [];

module.exports.SERVICE_CONNECTOR = {

    // Built-IN Connector ( Temporary )
    // 'http-connector': { },
    // 'mail-poll': ServiceEmail.MAIL_POLL,
    // 'mail-send': ServiceEmail.MAIL_SEND,

    'Magento': ServiceMagento.REST_MAGENTO,
    'Shopify': ServiceShopify.REST_SHOPIFY,

    'NetSuite-SOAP': ServiceNetSuite.SOAP_NETSUITE,

    'Email': ServiceEmail.EMAIL,

    'AMQP': ServiceAmqp.AMQP,
    'Kafka': ServiceKafka.KAFKA,

    'DeepLearning': ServiceDeepLearning.REST_DEEP_LEARNING

};

