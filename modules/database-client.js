const { MongoClient } = require("mongodb");
const dev = process.env.ENVIRONMENT ? false : require("../dev.json");

class DatabaseClient extends MongoClient {
    constructor(mongoURI, options) {
        super(mongoURI, options);
    
        this.database = "database";
        this.ready = false;
    }

    /**
     * Connects to the database and sets the client's 'ready' property to true
     * 
     * @returns {void}
     */
    async initConnection() {
        await this.connect();
        this.ready = true;
        console.log("MongoDB client is connected");
    }

    /**
     * Waits for the app to connect to the database
     * 
     * @returns {Promise<void>} The promise that resolves when the bot has connected to the database
     */
    async waitForReady() {
        return new Promise((resolve, _reject) => {
            var self = this;
            function isReady() {
                if (self.ready) resolve();
                setTimeout(isReady, 50);
            }
            return isReady();
        });
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

        var results;
        try {
            results = await this.db(this.database).collection(collection).findOne(filter);
        } catch (e) {
            console.error(e);
        }
        return results;
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

        var results;
        try {
            results = this.db(this.database).collection(collection).find(data);
        } catch (e) {
            console.error(e);
        }
        const resultsArr = await results.toArray().catch(console.error);
        return resultsArr;
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

        const results = await this.db(this.database).collection(collection).insertOne(data).catch(console.error);
        return results;
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

        const results = await this.db(this.database).collection(collection).deleteOne(filter).catch(console.error);
        return results;
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

        const results = await this.db(this.database).collection(collection).updateOne(
            filter,
            { $set: data },
            { upsert: true }
        ).catch(console.error);
        return results;
    }
}

const mongoURI = `mongodb+srv://${dev ? dev.MONGODB.USERNAME : process.env.MONGODB_USERNAME}:${dev ? dev.MONGODB.PASSWORD : process.env.MONGODB_PASSWORD}@ticketbot-database.6j5f4na.mongodb.net/database`
const client = new DatabaseClient(mongoURI);

client.initConnection();

module.exports = client;