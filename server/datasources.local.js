var db_conf = {};

// if LOOPBACK_DATASOURCE_CONNECTOR is set, assume we're using a custom connector
if (process.env.LOOPBACK_DATASOURCE_CONNECTOR) {
    db_conf[process.env.LOOPBACK_DATASOURCE_NAME] = {
        name: process.env.LOOPBACK_DATASOURCE_NAME,
        connector: process.env.LOOPBACK_DATASOURCE_CONNECTOR,
        database: process.env.LOOPBACK_DATASOURCE_DATABASE,
        debug: process.env.LOOPBACK_DATASOURCE_DEBUG,
        host: process.env.LOOPBACK_DATASOURCE_HOST,
        port: process.env.LOOPBACK_DATASOURCE_PORT,
        url: process.env.LOOPBACK_DATASOURCE_URL || null,
        username: process.env.LOOPBACK_DATASOURCE_USERNAME || null,
        password: process.env.LOOPBACK_DATASOURCE_PASSWORD || null
    }
}

module.exports = db_conf;