const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');

app.use(express.urlencoded());
app.use(bodyParser.json());

let [db,client,collection] = '';
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
    collection = db.collection('emails');
    
    app.post("/email",async(req,res)=>{
        let email = `${req.body.email}`.split('@')[0];
        let data = await collection.findOne({[email]:{ $exists : true }});
        if (data==null) {
            let acknowledgement = await collection.insertOne(
            {
                [email]:
                {
                    'workspaces':['Workspace 1'],
                    'cards':
                    {
                    'cards_name':['Card 1',0],
                    'cards_desc':['Card Description',0],
                    'cards_title':['Card Title',0],
                    },
                    'tasks':['Sip a Coffee',0]
                }
            })
            res.json({acknowledgement : acknowledgement.insertedId})
        }
        else{
            res.json(data[`${email}`])
        }
    })

    app.get("/loveit",(req,res)=>{
        res.send("Say hi");
    })

    app.listen(80, () => {
        console.log("Listen to: http://localhost:80");
    });
})