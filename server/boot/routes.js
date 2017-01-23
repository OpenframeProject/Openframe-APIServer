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

var debug = require('debug')('openframe:apiserver:routes');

module.exports = function(app) {

    /**
     * In dev environment, add an endpoint that lets us publish messages on the GEB
     *
     * The endpoint expects two query params, 'channel' which specifies the channel on which to publish,
     * and 'data', a JSON string of data to be parsed and passed along as the message payload.
     *
     * Example:
     *
     * http://localhost:8888/ps?channel=/frame/12345/connected&data={"some":"data"}
     */
    if (app.get('env') === 'development') {
        app.get('/ps', function(req, res) {
            const { channel, data } = req.query;
            if (channel) {
                let message = data ? JSON.parse(data) : null;
                debug(channel, message);
                app.pubsub.publish(channel, message);
                res.send(`Published message ${JSON.stringify(message)} to ${channel}`);
            } else {
                res.send(`No message published. Please specify a 'channel' query param.`);
            }
        });
    }

};

