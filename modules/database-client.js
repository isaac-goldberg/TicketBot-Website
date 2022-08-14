const { MongoClient } = require("mongodb");
const dev = require("../dev.json");

class DatabaseClient extends MongoClient {
    constructor(mongoURI, options) {
        super(mongoURI, options);
    
        this.ready = false;
        this.database = "database";
    }

    async awaitConnection() {
        await client.connect();
        this.ready = true;
        console.log("MongoDB client is connected");
    }

    /**
     * Finds one document in a collection
     * 
     * @param {string} collection The collection to search
     * @param {object} filter The data to filter the collection with
     * @returns {Promise<any>} The document found
     */
    async get(collection, filter) {
        if (typeof filter != "object") throw `The 'filter' parameter must be an object. Received ${typeof filter}`;
        return (await this.db(this.database).collection(collection).findOne(filter));
    }

    /**
     * Finds multiple documents in a collection
     * 
     * @param {string} collection The collection to search
     * @param {object} [data] The data to filter the collection with
     * @returns {Promise<Array>} An array of the documents matching the filter
     */
    async getMany(collection, data = {}) {
        if (typeof data != "object") throw `The 'data' parameter must be an object. Received ${typeof data}`;
        return (await (await this.db(this.database).collection(collection).find(data)).toArray());
    }

    /**
     * Inserts a document to a collection
     * 
     * @param {string} collection The collection to insert to 
     * @param {object} data The data to insert
     * @returns {Promise<any>} The document that was inserted
     */
    async set(collection, data) {
        if (typeof data != "object") throw `The 'data' parameter must be an object. Received ${typeof data}`;
        return (await this.db(this.database).collection(collection).insertOne(data));
    }

    /**
     * Deletes a document from a collection
     * 
     * @param {string} collection The collection to delete from
     * @param {object} filter The data to filter the collection with
     * @returns {Promise<any>} The document that was deleted
     */
    async delete(collection, filter) {
        if (typeof filter != "object") throw `The 'filter' parameter must be an object. Received ${typeof filter}`;
        return (await this.db(this.database).collection(collection).deleteOne(filter));
    }

    /**
     * Inserts a document if there are no documents matching the filter, otherwise updates the matching document with the new data
     * 
     * @param {string} collection The collection to upsert to
     * @param {object} filter The data to filter the collection with
     * @param {object} data The data to insert or update
     * @returns {Promise<any>} The document inserted or updated
     */
    async upsert(collection, filter, data) {
        if (typeof filter != "object") throw `The 'filter' parameter must be an object. Received ${typeof filter}`;
        if (typeof data != "object") throw `The 'data' parameter must be an object. Received ${typeof data}`;
        return (await this.db(this.database).collection(collection).updateOne(
            filter,
            { $set: data },
            { upsert: true }
        ));
    }
}

const mongoURI = `mongodb+srv://${dev ? dev.MONGODB.USERNAME : process.env.MONGODB_USERNAME}:${dev ? dev.MONGODB.PASSWORD : process.env.MONGODB_PASSWORD}@ticketbot-database.6j5f4na.mongodb.net/database`
const client = new DatabaseClient(mongoURI);

client.awaitConnection();

module.exports.awaitDatabase = () => {
    return new Promise((resolve, _reject) => {
        (function waitForReady() {
            if (client.ready) return resolve();
            setTimeout(waitForReady, 50);
        })();
    })
}

module.exports.databaseClient = client;