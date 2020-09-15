module.exports.DATABASE_CONNECTOR = {
    'Cassandra': {
        urlFormat: 'jdbc:cassandra://{DB_HOST}:{DB_PORT}/{keyspace}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '3.11', name: '3.11' },
            { value: '3.10', name: '3.10' },
            { value: '3.9', name: '3.9' },
        ],
    },
    'DB2': { 
        urlFormat: 'jdbc:db2://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '11.5', name: '11.5' },
        ],
    },
    'Derby': {
        urlFormat: 'jdbc:derby://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '10', name: '10' },
        ],
    },
    'DynamoDB': { 
        urlFormat: '',
        methods: [  ],
        versions: [
            { value: '2.5', name: '2.5' },
        ],
    },
    'ElasticDB': { 
        urlFormat: 'jdbc:es://{DB_HOST}:{DB_PORT}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '7.5', name: '7.5' },
            { value: '7.3', name: '7.3' },
            { value: '7.2', name: '7.2' },
            { value: '7.1', name: '7.1' },
            { value: '7.0', name: '7.0' },
        ],
    },
    'Exasol': { 
        urlFormat: 'jdbc:exa:{DB_HOST}:{DB_PORT}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '6.1', name: '6.1' },
        ],
    },
    'FrontBase': { 
        urlFormat: 'jdbc:frontbase://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '7.5', name: '7.5' },
        ],        
    },
    'H2': { 
        urlFormat: 'jdbc:h2:tcp:{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '1.4', name: '1.4' },
        ],
    },
    'HiveSQL': { 
        urlFormat: 'jdbc:hive2://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '3.1', name: '3.1' },
            { value: '3.0', name: '3.0' },
            { value: '2.3', name: '2.3' },
            { value: '2.2', name: '2.2' },
            { value: '2.1', name: '2.1' },
            { value: '2.0', name: '2.0' },
        ],
    },
    'HSQLDB': { 
        urlFormat: 'jdbc:hsqldb:hsql://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '2.5', name: '2.5' },
            { value: '2.4', name: '2.4' },
        ],
    },
    'MariaDB': { 
        urlFormat: 'jdbc:mariadb://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '10.5', name: '10.5' },
            { value: '10.4', name: '10.4' },
            { value: '10.3', name: '10.3' },
            { value: '10.2', name: '10.2' },
            { value: '10.1', name: '10.1' },
            { value: '10.0', name: '10.0' },
        ],
    },
    'MaxDB': {
        urlFormat: 'jdbc:sapdb://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '7.9', name: '7.9' },
        ],
    },
    'McKoi': {
        urlFormat: 'jdbc:mckoi://{DB_HOST}:{DB_PORT}/{DB_SCHEMA}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '1.0.6', name: '1.0.6' },
        ],
    },
    'MongoDB': {
        urlFormat: 'mongodb://{AUTH_USER}:{AUTH_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?authSource={AUTH_DB}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '4.2', name: '4.2' },
            { value: '4.0', name: '4.0' },
            { value: '3.6', name: '3.6' },
        ],
    },
    'MySQL': {
        urlFormat: 'jdbc:mysql://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '8.0', name: '8.0' },
            { value: '5.7', name: '5.7' },
        ],        
    },
    'Netezza': {
        urlFormat: 'jdbc:netezza://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '7.2', name: '7.2' },
        ],
    },
    'NuoDB': {
        urlFormat: 'jdbc:com.nuodb://{DB_HOST}:{DB_PORT}/{DB_NAME}?schema={DB_SCHEMA}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '3.3', name: '3.3' },
        ],
    },
    'OracleDB': {
        urlFormat: 'jdbc:oracle:thin:@{DB_HOST}:{DB_PORT}:{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '19c ', name: '19c' },
            { value: '18c ', name: '18c' },
            { value: '12c ', name: '12c' },
            { value: '11g ', name: '11g' },
            { value: '10g ', name: '10g' },
        ],
    },
    'Pervasive': {
        urlFormat: 'jdbc:pervasive://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '12', name: '12' },
            { value: '11', name: '11' },
            { value: '10', name: '10' },
        ],
    },
    'PostgreSQL': {
        urlFormat: 'jdbc:postgresql://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '12', name: '12' },
            { value: '11', name: '11' },
            { value: '10', name: '10' },
        ],
    },
    'RedisDB': {
        urlFormat: 'redis://{AUTH_PASSWORD}@{DB_HOST}:{DB_PORT}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '5.0', name: '5.0' },
            { value: '4.0', name: '4.0' },
        ],
    },
    'RedshiftDB': {
        urlFormat: 'jdbc:redshift://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '3.0', name: '3.0' },
            { value: '2.6', name: '2.6' },
        ],
    },
    'SAP_HANA': {
        urlFormat: 'jdbc:sap://{DB_HOST}:{DB_PORT}/?databaseName={DB_NAME}&user={AUTH_USER}&password={AUTH_PASSWORD}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '2.0', name: '2.0' },
            { value: '1.0', name: '1.0' }
        ],
    },
    'SQLServer': {
        urlFormat: 'jdbc:sqlserver://{DB_HOST}:{DB_PORT};databaseName={DB_NAME};username={AUTH_USER};password={AUTH_PASSWORD};',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '15.0', name: '15.0' },
            { value: '14.0', name: '14.0' },
            { value: '13.0', name: '13.0' },
            { value: '12.0', name: '12.0' },
            { value: '11.0', name: '11.0' },
            { value: '10.0', name: '10.0' },
        ],
    },
    'Vertica': {
        urlFormat: 'jdbc:vertica://{DB_HOST}:{DB_PORT}/{DB_NAME}',
        methods: [ 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM' ],
        versions: [
            { value: '9.2', name: '9.2' },
        ],
    },

};
