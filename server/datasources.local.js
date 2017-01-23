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
