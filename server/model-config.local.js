module.exports = {
    '_meta': {
        'sources': [
            'loopback/common/models',
            'loopback/server/models',
            '../common/models',
            '../node_modules/loopback-component-passport/lib/models',
            './models'
        ],
        'mixins': [
            'loopback/common/mixins',
            'loopback/server/mixins',
            '../common/mixins',
            './mixins'
        ]
    },
    'User': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'AccessToken': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'ACL': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'RoleMapping': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'Role': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'OpenframeUser': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': true,
        'options': {
            // 'emailVerificationRequired': true
        }
    },
    'Frame': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': true
    },
    'Artwork': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': true
    },
    'Collection': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': true
    },
    'OpenframeUserIdentity': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'OpenframeUserCredential': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'OpenframeAccessToken': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'Channel': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': true
    },
    'Email': {
        'dataSource': process.env.LB_EMAIL_DS_NAME || null
    }
};
