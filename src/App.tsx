import { useAuth } from './contexts/AuthContext';
import { Router, useRouter } from './components/Router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Activities } from './pages/Activities';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Donate } from './pages/Donate';
import { Volunteer } from './pages/Volunteer';
import { Dashboard } from './pages/Dashboard';
import { Privacy } from './pages/Privacy';
import { ScrollToTopButton } from './components/ScrollToTopButton';

function App() {
  const { currentPath, navigate } = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const routes = [
    { path: '/', component: () => <Home navigate={navigate} /> },
    { path: '/activities', component: () => <Activities navigate={navigate} /> },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
    { path: '/donate', component: Donate },
    { path: '/volunteer', component: Volunteer },
    { path: '/privacy', component: Privacy },
    { path: '/dashboard', component: Dashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <Navigation currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        <Router routes={routes} currentPath={currentPath} isAuthenticated={!!user} />
      </main>
      <Footer navigate={navigate} />
      <ScrollToTopButton />
    </div>
  );
}

export default App;
