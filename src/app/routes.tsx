import { createBrowserRouter } from 'react-router';
import Root from './Root';
import HomePage from './pages/HomePage';
import TrainingSessionPage from './pages/TrainingSessionPage';
import WorkoutsPage from './pages/WorkoutsPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditorPage from './pages/ProfileEditorPage';
import ConfigPage from './pages/ConfigPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PostSessionPage from './pages/PostSessionPage';
import RoutineDetailPage from './pages/RoutineDetailPage';
import RoutineEditorPage from './pages/RoutineEditorPage';
import SessionHistoryPage from './pages/SessionHistoryPage';
import MuscleProgressPage from './pages/MuscleProgressPage';
import HistoryPage from './pages/HistoryPage';
import SupportContactPage from './pages/SupportContactPage';
import TermsPage from './pages/TermsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'session', Component: TrainingSessionPage },
      { path: 'post-session', Component: PostSessionPage },
      { path: 'workouts', Component: WorkoutsPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'profile/edit', Component: ProfileEditorPage },
      { path: 'config', Component: ConfigPage },
      { path: 'config/password', Component: ChangePasswordPage },
      { path: 'config/help', Component: HelpCenterPage },
      { path: 'config/support', Component: SupportContactPage },
      { path: 'config/terms', Component: TermsPage },
      { path: 'routine/:id', Component: RoutineDetailPage },
      { path: 'routine-editor/:id', Component: RoutineEditorPage },
      { path: 'session-history/:id', Component: SessionHistoryPage },
      { path: 'muscle-progress/:id', Component: MuscleProgressPage },
      { path: 'history', Component: HistoryPage },
    ],
  },
]);
