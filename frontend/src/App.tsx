import { Container, Box } from "@chakra-ui/react"
import { Routes, Route, Navigate } from "react-router-dom"
import UserPage from './pages/UserPage';
import PostPage from "./pages/PostPage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./pages/CreatePost";
import ChatPage from "./pages/ChatPage"
import { useLocation } from "react-router-dom";
import SettingsPage from "./pages/SettingsPage";
import SidebarWithHeader from "./components/Sidebar";

const App = () => {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  const noSidebarPaths = ["/auth", "/reset-password"];
  const isNoSidebarPage = noSidebarPaths.some(path => pathname.startsWith(path));

  const AppContent = (
    <Box position={"relative"} w="full">
      <Container maxW={pathname === "/" ? { base:"620px", md:"900px" } : "620px" }>
        <Routes>  
          <Route path="/" element={user ? <HomePage /> : <Navigate to={"/auth"} />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to={"/"} />} />
          <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/:username" element={
            user ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          } />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
        </Routes>
      </Container>
    </Box>
  )

  return isNoSidebarPage ? AppContent : <SidebarWithHeader>{AppContent}</SidebarWithHeader>;
}

export default App
