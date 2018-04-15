const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Error connecting to MongoDB: ', err);
    }
    console.log('Connected to MongoDB');

    // deleteMany
    // db.collection('Todos').deleteMany({completed: true}).then((res) => {
    //     console.log(res);
    // });
    // deleteOne
    // db.collection('Todos').deleteOne({completed: true}).then((res) => {
    //     console.log(res);
    // });
    
    // findOneAndDelete
    // deletes first one it finds
    // returns deleted objected as value
    // db.collection('Todos').findOneAndDelete({completed: true}).then((res) => {
    //     console.log(res);
    // });

    // db.collection('Todos').findOneAndUpdate(
    //     {
    //     _id: new ObjectID('5ad306c24de2be81b280268d')
    //     }, 
    //     {
    //         $set: {
    //             completed: false
    //         },
    //     },
    //     {
    //         returnOriginal: false
    //     }).then((res) => {
    //         console.log(res);
    //     });

    // db.close();
});