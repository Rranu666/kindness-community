import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Notifies parent window (KCF main site) whenever the route changes
// so the address bar at kindnesscommunityfoundation.com/servekindness stays in sync.
function RouteChangeNotifier() {
  const location = useLocation();
  useEffect(() => {
    try {
      window.parent?.postMessage(
        { type: 'kcf:navigate', path: location.pathname + location.search },
        '*'
      );
    } catch (_) {}
  }, [location]);
  return null;
}
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import VolunteerDashboard from './pages/VolunteerDashboard';
import TeamPortal from './pages/TeamPortal';
import TeamPortalLanding from './pages/TeamPortalLanding';
import Analytics from './pages/Analytics';
import KindnessConnect from './pages/KindnessConnect';
import CommunityHub from './pages/CommunityHub';
import PostDetail from './pages/PostDetail';
import UserProfile from './pages/UserProfile';
import SuccessStories from './pages/SuccessStories';
import GivingDashboard from './pages/GivingDashboard';
import Login from './pages/Login';
import Admin from './pages/Admin';
import HelpOthersHealYourself from './pages/HelpOthersHealYourself';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Original KCF marketing homepage at root */}
      <Route path="/" element={<LayoutWrapper currentPageName={mainPageKey}><MainPage /></LayoutWrapper>} />
      <Route path="/community" element={<CommunityHub />} />
      <Route path="/Home" element={<LayoutWrapper currentPageName={mainPageKey}><MainPage /></LayoutWrapper>} />

      {/* Community platform routes */}
      <Route path="/post/:postId" element={<PostDetail />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/stories" element={<SuccessStories />} />

      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/VolunteerDashboard" element={
        <LayoutWrapper currentPageName="VolunteerDashboard">
          <VolunteerDashboard />
        </LayoutWrapper>
      } />
      <Route path="/TeamPortalLanding" element={<TeamPortalLanding />} />
      <Route path="/TeamPortal" element={<TeamPortal />} />
      <Route path="/KindnessConnect" element={<CommunityHub />} />
      <Route path="/GivingDashboard" element={<GivingDashboard />} />
      <Route path="/Analytics" element={
        <LayoutWrapper currentPageName="Analytics">
          <Analytics />
        </LayoutWrapper>
      } />
      <Route path="/Admin" element={<Admin />} />
      <Route path="/HelpOthers" element={<HelpOthersHealYourself />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <RouteChangeNotifier />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <>
                <NavigationTracker />
                <AuthenticatedApp />
              </>
            } />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App