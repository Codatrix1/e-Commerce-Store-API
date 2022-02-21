/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      product: new ObjectId("62124ddc95e585224fef8cec"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];

MongoClient.connect(
  " ",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db("10-E-COMMERCE-API").collection("reviews");
    coll.aggregate(agg, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  }
);

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg1 = [
  {
    $match: {
      product: new ObjectId("62124ddc95e585224fef8cec"),
    },
  },
  {
    $group: {
      _id: "$rating",
      ratingCount: {
        $sum: 1,
      },
    },
  },
];
