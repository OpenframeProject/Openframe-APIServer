var data_source_conf = {};

// if LP_DB_DS_CONNECTOR is set, assume we're using a custom db connector
if (process.env.LB_DB_DS_CONNECTOR) {
    data_source_conf[process.env.LB_DB_DS_NAME] = {
        name: process.env.LB_DB_DS_NAME,
        connector: process.env.LB_DB_DS_CONNECTOR,
        database: process.env.LB_DB_DS_DATABASE,
        debug: process.env.LB_DB_DS_DEBUG,
        host: process.env.LB_DB_DS_HOST,
        port: process.env.LB_DB_DS_PORT,
        url: process.env.LB_DB_DS_URL || null,
        username: process.env.LB_DB_DS_USERNAME || null,
        password: process.env.LB_DB_DS_PASSWORD || null
    };
}

// if LP_EMAIL_DS_CONNECTOR is set, assume we're using a custom db connector
if (process.env.LB_EMAIL_DS_CONNECTOR) {
    data_source_conf[process.env.LB_EMAIL_DS_NAME] = {
        name: process.env.LB_EMAIL_DS_NAME,
        connector: process.env.LB_EMAIL_DS_CONNECTOR,
        transports: [
            {
                type: process.env.LB_EMAIL_DS_TYPE || 'SMTP',
                host: process.env.LB_EMAIL_DS_HOST,
                //  only allow secure connection
                secure: true,
                port: process.env.LB_EMAIL_DS_PORT || 465,
                auth: {
                    user: process.env.LB_EMAIL_DS_USERNAME,
                    pass: process.env.LB_EMAIL_DS_PASSWORD
                }
            }
        ]
    };
}

module.exports = data_source_conf;
