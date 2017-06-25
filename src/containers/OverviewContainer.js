import React, {Component} from 'react';
import dbInstance from '../awsClient';

import OverviewList from '../components/OverviewList';

class OverviewContainer extends Component {
  state = {
    overview: {
      systems: []
    }
  };

  componentDidMount() {
    dbInstance(process.env).getOverview(data => {
      this.setState({overview: data});
    });
  }

  render() {
    return <OverviewList overview={this.state.overview} />;
  }
}

export default OverviewContainer;
