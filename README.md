# Openframe API

The Openframe API server.

> Note: This repo is under development and is not ready for use.

### Design Notes

This version of the API Server is built on [loopback](http://loopback.io/) and uses [MongoDB](https://docs.mongodb.org/manual/) as the persistence layer. The idea is to work towards a data model which supports the basic goals of Openframe, guided by a handful of [pilot use cases](https://github.com/OpenframeProject/Openframe-API/wiki/Pilot-Use-Cases).

At present, the API provides a basic RESTful interface to the data model. It represents the **API Server (REST)** in the diagram below. The Global Event Bus lives in a separate repository, [Openframe-PubSubServer](https://github.com/OpenframeProject/Openframe-PubSubServer).

![alt tag](https://raw.github.com/OpenframeProject/Openframe-API/restify/docs/img/API Diagram.jpg)

The block diagram above represents a proposed architecture for the Openframe platform. It will continue to evolve as development on the project progresses.

### Local Development

The codebase was largely generated following the [loopback docs'](https://docs.strongloop.com/display/public/LB/LoopBack) recommendations. To run the server locally, checkout this branch and run `npm start`. You'll need mongod to be available locally as well.

### API Docs

Loopback provides auto-generated documentation (via swagger) based on the data model definitions. After starting up the server locally, visit [localhost:8888/explorer/](http://localhost:8888/explorer/) to view the docs and test out the API.
