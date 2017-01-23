/*
Openframe-APIServer is the server component of Openframe, a platform for displaying digital art.
Copyright (C) 2017  Jonathan Wohl

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

module.exports = {
    '_meta': {
        'sources': [
            'loopback/common/models',
            'loopback/server/models',
            '../common/models',
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
            'emailVerificationRequired': true
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
        'public': false
    },
    'Channel': {
        'dataSource': process.env.LB_DB_DS_NAME || 'memoryDb',
        'public': false
    },
    'Email': {
        'dataSource': process.env.LB_EMAIL_DS_NAME || null
    }
};
