const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Error connecting to MongoDB: ', err);
    }
    console.log('Connected to MongoDB');

    db.collection('Todos').find(
        {
            // Why not string? _id is not a String it's a ObjectID object
            _id: new ObjectID("5ad306c24de2be81b280268d") 
        }
        ).toArray().then((docs) => {
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log(err);
        });

    // db.close();
});