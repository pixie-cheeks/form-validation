/* eslint-disable import/no-import-module-exports */
import './index.css';

console.log('Check whether everything is working or not.');

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}
