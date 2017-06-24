import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import BgsOverview from './pages/BgsOverview';

const Routes = (props) => (
  <Router {...props}>
    <Route exact path="/" component={BgsOverview}/>
  </Router>
);

export default Routes;
