# DrMongo

Dr. Mongo - the Meteor-based Mongo database manager

## Installation

Dr. Mongo runs as a separate Meteor application, so you need to have Meteor installed, first. Follow instructions here: http://docs.meteor.com/#/full/quickstart

```
$ /cd meteor
$ meteor create drmongo
$ cd drmongo
$ git clone --bare https://github.com/DrMongo/DrMongo.git
$ meteor --port 3040
```
Your Dr. Mongo isntance has to be running along with your other (development) Meteor app, so we use port 3040, but you are free to use any port.

Once your app is running, try: http://127.0.0.1:3040 in your browser.
