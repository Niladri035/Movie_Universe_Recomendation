import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store/store';
import App from './App';
import './styles/globals.scss';
import './styles/utilities.scss';
import './styles/components.scss';
import './styles/home.scss';
import './styles/detail.scss';
import './styles/auth.scss';
import './styles/search.scss';
import './styles/userhub.scss';
import './styles/admin.scss';
import './styles/footer.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
