ObjectId = function(_id) {
  this._id = _id;
};

ObjectId.prototype = {
  constructor: ObjectId,

  toString: function () {
    return `ObjectID('${this._id}')`;
  },

  // Return a copy of this instance
  clone: function () {
    return new ObjectId(this._id);
  },

  // Compare this instance to another instance
  equals: function (other) {
    if (!(other instanceof ObjectId))
      return false;

    return this._id == other._id;
  },

  // Return the name of this type which should be the same as the one
  // padded to EJSON.addType
  typeName: function () {
    return "ObjectId";
  },

  // Serialize the instance into a JSON-compatible value. It could
  // be an object, string, or whatever would naturally serialize
  // to JSON
  toJSONValue: function () {
    return {
      _id: this._id
    };
  }
};

// Tell EJSON about our new custom type
EJSON.addType("ObjectId", function fromJSONValue(value) {
  // the parameter - value - will look like whatever we
  // returned from toJSONValue from above.
  // console.log('fromJSONValue', value);
  return new ObjectId(value._id);
});
