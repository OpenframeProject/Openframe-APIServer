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
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'AccessToken': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'ACL': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'RoleMapping': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'Role': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'OpenframeUser': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': true
    },
    'Frame': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': true
    },
    'Artwork': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': true
    },
    'Collection': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'OpenframeUserIdentity': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'OpenframeUserCredential': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'OpenframeAccessToken': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    },
    'Channel': {
        'dataSource': process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb',
        'public': false
    }
};
