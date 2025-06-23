import React from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import * as ReactRouter from 'react-router-dom';
import * as Mui from '@mui/material';
import router from './router';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Mui.CssBaseline />
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <ReactRouter.RouterProvider router={router} />
    </SnackbarProvider>
  </React.StrictMode>
);
