import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Cookie from "cookie-universal";
import axios from "axios";

import { TooltipProvider } from './components/ui/tooltip'
import { RouterProvider } from 'react-router-dom'
import router from './utils/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';


const cookies = Cookie();

axios.defaults.baseURL = import.meta.env.VITE_API;

const savedToken = cookies.get("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== "/login") {
        cookies.remove("token", { path: "/" });
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>

  </StrictMode>,
)
