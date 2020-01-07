import React from 'react';
import ReactDOM from 'react-dom';
import "core-js/stable";
import "regenerator-runtime/runtime";
import './style.css'
import App from './components/App';

const newNode = document.createElement("div")
newNode.id = "root"

document.body.append(newNode)

ReactDOM.render(
  <App />,
  newNode
);

module.hot.accept();
