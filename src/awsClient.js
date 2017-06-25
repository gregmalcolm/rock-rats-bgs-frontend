let AWS = require('aws-sdk')

class AwsClient {
  constructor(env) {
    this.env = env;
  }

  db() {
    if (!this._db) {
      this._db = new AWS.DynamoDB({
        region: 'us-east-1',
        credentials: {
          accessKeyId: this.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: this.env.REACT_APP_AWS_SECRET_ACCESS_KEY
        }
      });
    }

    return this._db;
  }

  getOverview(callback) {
    this.db().scan({
        TableName: 'rock-rat-factions',
        IndexName: 'date-index',
        FilterExpression: '#entrydate >= :lastweek',
        ExpressionAttributeNames: {"#entrydate": "date"},
        ExpressionAttributeValues: {":lastweek": {S: this._lastWeek()}},
        Limit: 2000
      },
      (err, data) => {
        if (err) {
          console.error(err);
        } else {
          this._sendOverviewResponse(callback, data);
        }
      }
    );
  }

  _lastWeek() {
    const d = new Date();
    d.setDate(d.getDate()-7);
    const lastWeek = '' +
      d.getUTCFullYear() + '-' +
      ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' +
      ('0' + d.getUTCDate()).slice(-2);
    return lastWeek;
  }

  _sendOverviewResponse(callback, data) {
    const systemNames = [...new Set(
      data.Items.map(item => { return item.system.S; })
        .sort()
    )];
    callback({
      systems: systemNames.map((systemName) => {
        return this._systemOverview(data, systemName);
      }, {})
    });
  }

  _systemOverview(data, systemName) {
    return {
      systemName: systemName
      //factions: this._factionsOverview(data, systemName)
    };
  }
};

let instance = null;

const dbInstance = (env) => {
  if (!instance) {
    instance = new AwsClient(env);
  }
  return instance;
}

export default dbInstance;
