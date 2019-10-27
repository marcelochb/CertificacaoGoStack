import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react-native';
import sentryConfig from './config/sentry';

import './config/ReactotronConfig';

import { store, persistor } from './store';
import App from './App';

class Index extends Component {
  constructor(props) {
    super(props);

    Sentry.init(sentryConfig);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

export default Index;
