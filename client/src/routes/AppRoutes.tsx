import { Route, Routes } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminQueueDashboardPage } from '../pages/AdminQueueDashboardPage';
import { HomePage } from '../pages/HomePage';
import { JoinQueuePage } from '../pages/JoinQueuePage';
import { QueueStatusPage } from '../pages/QueueStatusPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="/join/:queueId" element={<JoinQueuePage />} />
        <Route path="/status/:entryId" element={<QueueStatusPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/queues/:queueId"
          element={<AdminQueueDashboardPage />}
        />
      </Route>
    </Routes>
  );
}
