import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const title = 'My Minimal React Webpack Babel Setup';
const newNode = document.createElement("div")
newNode.id = "root"

document.body.append(newNode)

ReactDOM.render(
  <App title={title} />,
  newNode
);

module.hot.accept();
