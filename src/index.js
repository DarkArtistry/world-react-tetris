import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import MiniKitProvider from './components/minikit-provider';
import store from './store';
import App from "./containers";
import './unit/const';
import './control';
import { subscribeRecord } from './unit';

subscribeRecord(store); // 将更新的状态记录到localStorage

render(
  <MiniKitProvider><Provider store={store}>
    <App />
  </Provider></MiniKitProvider>,
  document.getElementById('root'),
);
