// mongoclient let's you connect to mongo server easily
// const MongoClient = require('mongodb').MongoClient;
// same as above - ES 6 destructuring
// ObjectID => can create object IDs on the fly
const { MongoClient, ObjectID } = require('mongodb');

// get a timeStamp
// console.log(new ObjectID());

// 1: url for db, 2: cb
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Error connecting to MongoDB: ', err);
    }
    console.log('Connected to MongoDB');

    db.collection('Todos').insertOne({
        text: 'to do smt',
        completed: false
    }, (err, res) => {
        if (err) {
          return console.log('error inserting: ', err);
        }

        // ids contain timestamp
        console.log(res.ops[0]._id.getTimestamp());
    });

    db.close();
});