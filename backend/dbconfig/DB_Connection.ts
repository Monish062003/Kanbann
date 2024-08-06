import { MongoClient } from 'mongodb';

export let [db, collection]: any = '';
export async function connectToDatabase() {
    try {
        const client: any = await MongoClient.connect('mongodb+srv://Monish:mmonish875@cluster0.7pfxpj7.mongodb.net/');
        db = client.db('Kanbann');
        console.log('Connected to the database');
        collection = db.collection('users')
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}
