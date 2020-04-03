const MongoClient = require('mongodb').MongoClient;

class Connection {
  static connectToMongo() {
    if ( this.db ) return Promise.resolve(this.db);
    return MongoClient.connect(this.url, this.options).then(db => this.db = db);
  }
}

Connection.db = null;
Connection.url = 'mongodb://127.0.0.1:27017/Turdo';
Connection.options = {
  useUnifiedTopology: true,
  bufferMaxEntries:   0,
  useNewUrlParser: true
};

module.exports = { Connection }