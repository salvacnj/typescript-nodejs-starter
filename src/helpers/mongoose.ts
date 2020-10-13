import * as mongoose from 'mongoose';

/**
 * Connect to database
 *
 * Url pattern: mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
 *
 * @param mongo_uri Url to connect
 *
 */
export function connect(mongo_uri): Promise<typeof mongoose> {
  return mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
}

export class CrudMongoDb {
  private table: mongoose.Model<mongoose.Document>;


  constructor(table: mongoose.Model<mongoose.Document>) {
    this.table = table;
  }

  public create(newEntry: Object) {
    return new Promise((resolve, reject) => {
      this.table.create(newEntry, (e, newEntry) => {
        if (e) {
          reject(e);
        } else {
          resolve(newEntry);
        }
      });
    });
  };


  // =========
  // Read many
  // =========
  public readMany() {
    return new Promise((resolve, reject) => {
      this.table.find({}, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
  };

  // ========
  // Read one
  // ========
  public readOne(_id) {
    return new Promise((resolve, reject) => {
      this.table.findById(_id, (e, result) => {
        if (e || !result) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
  };

  // ======
  // Update
  // ======
  public update(_id, changedEntry) {
    return new Promise((resolve, reject) => {
      this.table.findByIdAndUpdate(_id, changedEntry, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve(changedEntry);
        }
      });
    });
  };

  // ======
  // Remove
  // ======
  public remove(_id) {
    return new Promise((resolve, reject) => {
      this.table.deleteOne({_id: _id}, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve('');
        }
      });
    });
  };
}
