# Openframe API

The Openframe API server.

> Note: This repo is under development and is not ready for use.

### Design Notes

This prototype of the API Server is built on [Restify](http://restify.com/) and [MongoDB](https://docs.mongodb.org/manual/). The goal is to work towards a data model which supports the basic goals of Openframe, guided by a handful of [pilot use cases](https://github.com/OpenframeProject/Openframe-API/wiki/Pilot-Use-Cases).

At present, the API is a basic RESTful interface along with a websocket event interface. Moving forward, our aim is to develop a unified event system which can be accessed via an authenticated websocket connection or triggered via the RESTful API.

The block diagram below represents a proposed architecture for the Openframe platform. It will continue to evolve as development on the project progresses.

![alt tag](https://raw.github.com/OpenframeProject/Openframe-API/master/docs/img/API Diagram.jpg)

### API Docs

For the moment, the API is specified using [Swagger](http://swagger.io), and the definition file is included in the root of this repo (swagger.json). A simplified version of the Swagger docs is in the gh-pages branch, viewable [here](http://openframeproject.github.io/Openframe-API/), which pulls directly from the swagger.json file in the master branch. To be clear, the specification does not generate the API itself (though it could in the future); it is simply a nice way to go about designing and documenting the API.

If you want to play around with the API specification, pull up the [Swagger editor](http://editor.swagger.io/) and import the swagger.json file.

### TODOs / Considerations / Questions

* Update swagger.json to match current API (and keep it up to date!)
* [Faye](http://faye.jcoglan.com/) might make a good global event system.
* Do we allow user-defined events to be propogated?
