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

  _subtractDays(currentDate, noOfDays) {
    const d = new Date(currentDate);
    d.setDate(d.getDate()-noOfDays);
    const subtractedDate = '' +
      d.getUTCFullYear() + '-' +
      ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' +
      ('0' + d.getUTCDate()).slice(-2);
    return subtractedDate;
  }

  _sendOverviewResponse(callback, data) {
    const systemNames = [...new Set(
      data.Items.map(item => { return item.system.S; })
        .sort()
    )];
    const dates = [...new Set(
      data.Items.map(item => { return item.date.S; })
        .sort().reverse()
    )];
    const systemsOverview = systemNames.map(systemName => {
      const systemData = data.Items
        .filter(item => {return systemName === item.system.S;})
        .sort((a, b) => {
          return new Date(b.date.S) - new Date(a.date.S)
        });
      return this._systemOverview(systemData, systemName, dates);
    }, {});
    callback({
      systems: systemsOverview,
      dates: dates
    });
  }

  _systemOverview(systemData, systemName, dates) {
    const factionNames = systemData
      .filter(item => { return item.date.S === dates[0]; })
      .sort((a, b) => { return b.influence.N - a.influence.N})
      .map(item => { return item.faction.S });
    return {
      systemName: systemName,
      systemClassName: `overview-system overview-system-${this._htmlClassName(systemName)}`,
      date: dates[0],
      collector: this._awsString(systemData[0].commander),
      collectionMethod: this._awsString(systemData[0].updateType),
      factions: factionNames.map(factionName => {
        return this._factionOverview(systemData, factionName, dates);
      })
    };
  }

  _factionOverview(systemData, factionName, dates) {
    const factionData = systemData
      .filter(item => { return factionName === item.faction.S})
      .sort((a, b) => { return new Date(b.date.S) - new Date(a.date.S)});

    if (factionData && factionData.length > 0) {
      const today = factionData[0];
      return {
        factionName: this._awsString(today.faction),
        influence: this._awsNumber(today.influence),
        influenceDiffs: this._influenceDiffs(factionData),
        state: this._awsString(today.state),
        daysInState: this._daysInState(factionData),
        enteredBy: this._awsString(today.commander),
        method: this._awsString(today.updateType)
      }
    } else {
      return [];
    }
  }

  _influenceDiffs(factionData) {
    const diffs = this._allInfluenceDiffs(factionData);

    const oneDay = this._findInfluenceDiff(diffs, 1);
    const twoDays = this._findInfluenceDiff(diffs, 2);
    const week = this._findInfluenceDiff(diffs, 7);

    return {
      oneDay: this._formatDiff(oneDay),
      twoDays: this._formatDiff(twoDays),
      week: this._formatDiff(week)
    }
  }

  _formatDiff(diffValue) {
    if (diffValue) {
      if (diffValue > 0) {
        return `+${diffValue}%`;
      } else if (parseFloat(diffValue) === 0.0) {
        return ''
      } else {
        return `${diffValue}%`;
      }

    } else {
      return "Unknown"
    }
  }

  _findInfluenceDiff(diffs, noOfDays) {
    const diff = diffs.find(item => {
      return item.daysDiff === noOfDays;
    });

    if (diff) {
      return diff.influenceDiff;
    }
  }

  _allInfluenceDiffs(factionData) {
    const currentDate=this._awsString(factionData[0].date);
    const currentInfluence=parseFloat(this._awsNumber(factionData[0].influence));
    return factionData.slice(1).map(item => {
      const date = this._awsString(item.date);
      const influence = parseFloat(this._awsNumber(item.influence));
      const daysDiff =
        (new Date(currentDate) - new Date(date)) / (1000*60*60*24);
      const influenceDiff = (influence - currentInfluence).toFixed(2);
      return {
        date: date,
        daysDiff: daysDiff,
        influenceDiff: influenceDiff
      }
    });
  }

  _daysInState(factionData) {
    let count = null;
    const currentState=this._awsString(factionData[0].state);
    if (currentState) {
      let n = null;
      for(n = 1; n < factionData.length; n++) {
        const item = factionData[n];

        if (this._awsString(item.state) !== currentState) {
          break;
        }
      }

      if (n > 1) {
        count =
          ((new Date(factionData[0].date.S) - new Date(factionData[n - 1].date.S))
            / (1000*60*60*24)) + 1;
      } else {
        count = 1;
      }
    }
    return count;
  }

  _awsString(value) {
    return value ? value.S : null;
  }

  _awsNumber(value) {
    return value ? value.N : null;
  }

  _htmlClassName(value) {
    let className = "";
    if (value) {
      className = value
        .replace(/ /g,'-')
        .replace(/[^-\w]+/,'')
        .toLowerCase()
    }
    return className;
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
