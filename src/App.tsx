import { lazy, Suspense } from 'react';
import { Outlet, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { RoomNavigation } from './components/ui/RoomNavigation';
import { ExperienceControls } from './components/ui/ExperienceControls';
import { DoorTransition } from './components/animations/DoorTransition';
import { Preloader } from './components/animations/Preloader';
import { RoomLoader } from './components/animations/RoomLoader';
import { CustomCursor } from './components/animations/CustomCursor';
import { ScrollManager, SmoothScroll } from './components/animations/SmoothScroll';
import { ExternalLink } from './components/ui/Primitives';
import { RecoveryScreen } from './components/ui/RecoveryScreen';
import { MotionProvider } from './hooks/useMotionSettings';
import { ThemeProvider } from './hooks/useTheme';
import Home from './pages/Home';
import styles from './App.module.css';

const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SiteMap = lazy(() => import('./pages/SiteMap'));

function SiteLayout() {
  return (
    <MotionProvider>
      <ThemeProvider>
        <ExternalLink href="#main-content" className={styles.skipLink}>Skip to content</ExternalLink>
        <SmoothScroll /><ScrollManager /><Header />
        <main id="main-content" tabIndex={-1}>
          <Suspense fallback={<RoomLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer /><RoomNavigation /><ExperienceControls /><DoorTransition /><CustomCursor /><Preloader />
      </ThemeProvider>
    </MotionProvider>
  );
}

const router = createBrowserRouter([{
  element: <SiteLayout />,
  errorElement: <RecoveryScreen error />,
  children: [
    { index: true, element: <Home /> },
    { path: 'projects', element: <Projects /> },
    { path: 'projects/:slug', element: <ProjectDetail /> },
    { path: 'about', element: <About /> },
    { path: 'sitemap', element: <SiteMap /> },
    { path: '*', element: <NotFound /> },
  ],
}]);

export default function App() {
  return <RouterProvider router={router} />;
}
