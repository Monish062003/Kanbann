import { MongoClient } from "mongodb";

export let [db, collection, collection1, collection2]: any = "";
export async function connectToDatabase() {
  try {
    const client: any = await MongoClient.connect(
      "mongodb+srv://Monish:mmonish875@cluster0.7pfxpj7.mongodb.net/"
    );
    db = client.db("Kanbann");
    console.log("Connected to the database");
    collection = db.collection("users");
    collection1 = db.collection("usersdata");
    collection2 = db.collection("groups");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}
