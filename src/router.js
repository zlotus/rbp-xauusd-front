import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import IndexPage from './routes/IndexPage';
import XauusdPage from './routes/XauusdRoute';

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage}/>
        <Route path="/charts" exact component={XauusdPage}/>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
