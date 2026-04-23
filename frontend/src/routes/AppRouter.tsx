/**
 * AppRouter — All application routes
 * Landing page for visitors, Dashboard for logged-in users
 */
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/newdash";
import ProfilePage from "../pages/Profile";
import DiscussPage from "../pages/DiscussPage";
import PostDetailPage from "../pages/PostDetailPage";
import CreatePostPage from "../pages/CreatePostPage";
import AuthFinish from "../pages/AuthFinish";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/auth/finish" element={<AuthFinish />} />

      {/* Protected (auth checked in components) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/discuss" element={<DiscussPage />} />
      <Route path="/discuss/new" element={<CreatePostPage />} />
      <Route path="/discuss/:postId" element={<PostDetailPage />} />
    </Routes>
  );
};

export default AppRouter;
