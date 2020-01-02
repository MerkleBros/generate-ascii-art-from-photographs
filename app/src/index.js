import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const newNode = document.createElement("div")
newNode.id = "root"

document.body.append(newNode)

ReactDOM.render(
  <App />,
  newNode
);

module.hot.accept();
