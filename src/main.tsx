import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app';
import { LoaderMain } from './components/Loader/Loader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <StrictMode>
  <Suspense fallback={<LoaderMain />}>
    <App />
  </Suspense>
  // </StrictMode>
);
