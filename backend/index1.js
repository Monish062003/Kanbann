const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');

app.use(express.urlencoded());
app.use(bodyParser.json());

// let [db,client,collection] = '';
async function connectToDatabase() {
    try {
        client = await MongoClient.connect('mongodb+srv://Monish:mmonish875@cluster0.7pfxpj7.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('Kanban');
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}

connectToDatabase().then(async() => {

    app.get("/loveit",(req,res)=>{
        res.send("Say hi");
    })

    app.listen(80, () => {
        console.log("Listen to: http://localhost:80");
    });
})