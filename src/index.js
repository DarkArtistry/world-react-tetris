import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from 'react-dom/client'
import { Provider } from "react-redux";
import store from "./store";
import App from "./containers";
import "./unit/const";
import "./control";
import { unit } from "./unit";

// 将更新的状态记录到localStorage
unit.subscribeRecord(store);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement); // Create a root
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
