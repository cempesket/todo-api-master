const {MongoClient, ObjectID} = require('mongodb');


const logJSONData = data => console.log(JSON.stringify(data, undefined, 2));


const exec = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const todoCollection = client.db('TodoApp').collection('users');
    // const result = await todoCollection.insertMany([{name: 'Cem', age: 20}, {name: 'Anna', age: 20}, {
    //     name: 'Natasha',
    //     age: 30
    // }]);
    //logJSONData(await todoCollection.find().toArray());
    console.log(await todoCollection.find().count());

    //console.log(await todoCollection.deleteMany({name: 'Anna'}));

    await todoCollection.findOneAndUpdate({_id: new ObjectID('5acfcca5b498f9251caa16d0')}, {
        $set: {name: 'Anna'},
        $inc: {age: 100}
    });

    await client.close(false);
};

exec().catch();







