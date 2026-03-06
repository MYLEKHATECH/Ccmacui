import { createBrowserRouter } from 'react-router';
import { AppShell } from './components/AppShell';
import { Onboarding } from './pages/Onboarding';
import { SmartCare } from './pages/SmartCare';
import { Cleanup } from './pages/Cleanup';
import { Protection } from './pages/Protection';
import { Performance } from './pages/Performance';
import { Applications } from './pages/Applications';
import { MyClutter } from './pages/MyClutter';
import { SpaceLens } from './pages/SpaceLens';
import { CloudCleanup } from './pages/CloudCleanup';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Onboarding,
  },
  {
    path: '/app',
    Component: AppShell,
    children: [
      { index: true, Component: SmartCare },
      { path: 'cleanup', Component: Cleanup },
      { path: 'protection', Component: Protection },
      { path: 'performance', Component: Performance },
      { path: 'applications', Component: Applications },
      { path: 'clutter', Component: MyClutter },
      { path: 'space-lens', Component: SpaceLens },
      { path: 'cloud', Component: CloudCleanup },
      { path: 'assistant', Component: AIAssistant },
      { path: 'settings', Component: Settings },
    ],
  },
]);