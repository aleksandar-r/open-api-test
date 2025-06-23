import * as ReactRouter from 'react-router-dom';
import * as Common from './common';
import * as IntelligenceDashboard from './intelligence-dashboard';

const router = ReactRouter.createBrowserRouter([
  {
    path: Common.Routes.HOME(),
    element: <IntelligenceDashboard.HomeElement />
  },
  {
    path: Common.Routes.HOME(':id'),
    element: <IntelligenceDashboard.UpsertElement />
  }
]);

export default router;
