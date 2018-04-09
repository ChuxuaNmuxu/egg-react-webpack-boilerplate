import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import routers from './routers';
import uuid from 'uuid';

class App extends Component {
  render() {
    return <div>
      <Switch>
          {
              routers.map(router => {
                const {fetch, id = uuid.v1(), ...rest} = router;
                return <Route {...rest} key={id} />
              })
          }
      </Switch>
    </div>;
  }
}

export default App;
