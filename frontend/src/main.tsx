import { StrictMode } from 'react'; // Add StrictMode here
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/configure_store';

const container = document.getElementById('root');

// The "!" tells TypeScript that 'container' definitely exists
const root = createRoot(container!); 
root.render(
  <Provider store={store}>
  <StrictMode>
    <App />
  </StrictMode>
  </Provider>
);