import { useState, useEffect } from 'react';

type Route = {
  path: string;
  component: React.ComponentType;
  protected?: boolean;
};

type RouterProps = {
  routes: Route[];
  currentPath: string;
  isAuthenticated: boolean;
};

export function Router({ routes, currentPath, isAuthenticated }: RouterProps) {
  const route = routes.find(r => r.path === currentPath);

  if (!route) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600">Page not found</p>
      </div>
    </div>;
  }

  if (route.protected && !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600">Please log in to access this page</p>
      </div>
    </div>;
  }

  const Component = route.component;
  return <Component />;
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return { currentPath, navigate };
}
