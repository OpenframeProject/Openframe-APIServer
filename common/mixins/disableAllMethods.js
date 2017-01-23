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


/**
 * Based on @ericprieto code https://github.com/strongloop/loopback/issues/651#issuecomment-140879983
 * place this file into common/mixins/disableAllMethods.js
 *
 **/

module.exports = function(Model, options) {
    if(Model && Model.sharedClass) {
      var methodsToExpose = options.expose || [];
      var modelName = Model.sharedClass.name;
      var methods = Model.sharedClass.methods();
      var relationMethods = [];
      var hiddenMethods = [];
      try {
          Object.keys(Model.definition.settings.relations).forEach(function(relation) {
              relationMethods.push({ name: '__findById__' + relation});
              relationMethods.push({ name: '__destroyById__' + relation});
              relationMethods.push({ name: '__updateById__' + relation});
              relationMethods.push({ name: '__exists__' + relation});
              relationMethods.push({ name: '__link__' + relation});
              relationMethods.push({ name: '__get__' + relation});
              relationMethods.push({ name: '__create__' + relation});
              relationMethods.push({ name: '__update__' + relation});
              relationMethods.push({ name: '__destroy__' + relation});
              relationMethods.push({ name: '__unlink__' + relation});
              relationMethods.push({ name: '__count__' + relation});
              relationMethods.push({ name: '__delete__' + relation});
          });
      } catch(err) {}
      methods.concat(relationMethods).forEach(function(method) {
          var methodName = method.name;
          if(methodsToExpose.indexOf(methodName) < 0) {
              hiddenMethods.push(methodName);
              Model.disableRemoteMethodByName(methodName);
          }
      });
      // if(hiddenMethods.length > 0) {
      //     console.log('\nRemote mehtods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
      // }
    }
};
