import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Cookie from "cookie-universal";
import axios from "axios";

import { TooltipProvider } from './components/ui/tooltip'
import { RouterProvider } from 'react-router-dom'
import router from './utils/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const cookies = Cookie();
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API;
// axios.defaults.headers.common.Authorization = "Bearer " + Cookie().get("token");

axios.interceptors.request.use((config) => {
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

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
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>

  </StrictMode>,
)
