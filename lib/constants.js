dr = {};

dr.collectionNamePrefix = 'drmongo.';

if (Meteor.isServer) {
  dr.isDemo = process.env.ENVIRONMENTTYPE == 'demo';
} else {
  dr.isDemo = document.domain == 'demo.drmongo.com';
}

console.log("isDemo", dr.isDemo);
