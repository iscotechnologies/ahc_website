import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './components/shared/Toast';
import { SettingsProvider } from './context/SettingsContext';
import { router } from './router.tsx';

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

export default App;

