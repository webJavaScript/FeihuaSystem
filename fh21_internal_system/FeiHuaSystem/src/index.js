import React from 'react';
import ReactDOM from 'react-dom';
import FhShell from './script/fh/shell/fhShell';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

var fh_system = document.getElementById('fh_system');

ReactDOM.render(<FhShell />, fh_system);
registerServiceWorker();
