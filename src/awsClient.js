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
        FilterExpression: '#entrydate > :lastweek',
        ExpressionAttributeNames: {"#entrydate": "date"},
        ExpressionAttributeValues: {":lastweek": {S: "2017-06-20"}},
        Limit: 2000
      },
      function(err, data) {
        if (err) {
          console.error(err);
        } else {
          callback({
            systems: [...new Set(
              data.Items.map(item => { return item.system.S })
                .sort()
            )]
          });
        }
      }
    );
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
