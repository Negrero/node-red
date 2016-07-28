/**
 * Copyright 2014, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var when = require("when");

var log = require("../log");

var projectsCache = {};
var storage = null;
var runtime = null;
var projectsFlows=null
module.exports = {
    init: function (_runtime) {
        runtime=_runtime
        storage = runtime.storage;
    },

    /**
     * Loads the projects from storage.
     */
    load: function () {
        return storage.getProjects().then(function (_projects) {
            _projects.forEach(function(e,i,a){
                e.flows=[]
                projectsCache[e._id]={}
                projectsCache[e._id]=e
            })
            storage.getFlows().then(function(flows){
              flows.forEach(function(e,i,a){
                  if(projectsCache[e.projectId]!==undefined && e.type==="tab")
                    projectsCache[e.projectId].flows.push(e.id)
              })

            })

        }).otherwise(function (err) {
            log.warn(log._("nodes.credentials.error",{message: err}));
        });
    },

    /**
     * Adds a set of credentials for the given node id.
     * @param id the node id for the credentials
     * @param creds an object of credential key/value pairs
     * @return a promise for the saving of credentials to storage
     */
    add: function (id, creds) {
        projectsCache[id] = creds;
        return storage.saveProjects(credentialCache);
    },

    /**
     * Gets the credentials for the given node id.
     * @param id the node id for the credentials
     * @return the credentials
     */
    get: function (id) {
        if (id) {
            return projectsCache[id];
        } else {
            return projectsCache;
        }
    },

    /**
     * Deletes the credentials for the given node id.
     * @param id the node id for the credentials
     * @return a promise for the saving of credentials to storage
     */
    delete: function (id) {
        delete projectsCache[id];
        storage.saveProjects(projectsCache);
    },

    /**
     * Saves the credentials to storage
     * @return a promise for the saving of credentials to storage
     */
    save: function () {
        return storage.saveProjects(credentialCache);
    }

}
