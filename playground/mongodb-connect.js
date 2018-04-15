// mongoclient let's you connect to mongo server easily
const MongoClient = require('mongodb').MongoClient;

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

        console.log(JSON.stringify(res.ops, undefined, 2));
    });

    db.close();
});