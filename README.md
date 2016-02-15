# Openframe API

The Openframe API server.

> Note: This repo is under development and is not ready for use.


### Design Notes

This version of the API Server is built on [loopback](http://loopback.io/). The idea is to work towards a data model which supports the basic goals of Openframe, guided by a handful of [pilot use cases](https://github.com/OpenframeProject/Openframe-API/wiki/Pilot-Use-Cases).

At present, the API provides a basic RESTful interface to the data model. It represents the **API Server (REST)** in the diagram below. The Global Event Bus lives in a separate repository, [Openframe-PubSubServer](https://github.com/OpenframeProject/Openframe-PubSubServer).

![alt tag]('https://raw.github.com/OpenframeProject/Openframe-API/restify/docs/img/API Diagram.jpg')

The block diagram above represents a proposed architecture for the Openframe platform. It will continue to evolve as development on the project progresses.


### Running an Openframe API Server

This package provides a cli which can be used to start up a server. Install the package with npm, and run `openframe-apiserver` to start it.

```bash
$ sudo npm install -g openframe-apiserver

# start the server...
$ openframe-apiserver
```

For full DEBUG output (includes a lot due to loopback), set the DEBUG env var:

```bash
$ DEBUG=* openframe-apiserver
```

If you're not running an instance of the pubsub server separately, you can start up an instance of that concurrently by passing the `-p` parameter.

```bash
# start the API server and PubSub server
$ openframe-apiserver -p
```


### Local Development

The codebase was largely written following the [loopback docs'](https://docs.strongloop.com/display/public/LB/LoopBack) recommendations and examples. To run the server locally, checkout this branch and run `npm start`. By default the API server will use an in-memory data store and will generate some dummy data (a few users, a few artworks).

This repo includes the [pubsub server](https://github.com/OpenframeProject/Openframe-PubSubServer) as a dev dependency, so you can run that without installing it separately. To spin up an instance running on port 8889, open another terminal window to this repo and run the `start-pubsub` command:

```bash
$ npm run start-pubsub
```


### API Docs

Loopback provides auto-generated documentation (via swagger) based on the data model definitions. After starting up the server locally, visit [localhost:8888/explorer/](http://localhost:8888/explorer/) to view the docs and test out the API.
