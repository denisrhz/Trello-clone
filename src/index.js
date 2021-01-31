import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

import Board from "./components/Board";

import { Provider } from "react-redux";
import store from "./reducers/store";

import { BrowserRouter, Route, useParams, Link } from "react-router-dom";

import "./index.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <div className="Header"><Link to="/">React Trello Clone</Link></div>
      <Route exact path="/" children={<App />} />
      <Route exact path="/:boardId" children={<Child />} />
    </BrowserRouter>
  </Provider>,
  rootElement
);

function Child() {
  let { boardId } = useParams();

  return (
  <div>
      <Board boardId={boardId} key={boardId}></Board>
  </div>
  );
}