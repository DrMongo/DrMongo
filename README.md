# Dr. Mongo

MongoDB admin app built on MeteorJs.

Dr. Mongo is a stand-alone application allowing you to connect to several Mongo DB simultaneously. This means you only have to have one instance running to connect to any of your databases.

## Installation

Dr. Mongo runs as a Meteor application, so you need to have Meteor installed, first.
```
curl https://install.meteor.com/ | sh
```
_More info about installing meteor: https://www.meteor.com/install_

Then clone and run Dr. Mongo:
```
$ git clone https://github.com/DrMongo/DrMongo.git
$ cd DrMongo
$ meteor --port 3040
```
_Your Dr. Mongo instance has to be running along with your other Meteor apps, so we use port 3040, but you are free to use any port._

Once your app is running, go to: http://127.0.0.1:3040


### Connecting to Meteor database
Field | Value | |
------|-------|------|
**Host** | localhost | |
**Port** | 3001 | _If your meteor running on port 3000 use port 3001 in connection as Meteor always creates its mongodb on a port of app + 1._ |

## FAQ
#### Can be Dr. Mongo installed as meteor package?
Not yet. We are planning on building Dr. Mongo as a OSX/Win/Linux application and as a Meteor package, also.
