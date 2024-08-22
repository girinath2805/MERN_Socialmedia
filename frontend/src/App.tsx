import { Button, Container, useColorModeValue } from "@chakra-ui/react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import UserPage from './pages/UserPage';
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/LogoutButton";
import ResetPassword from "./pages/ResetPassword";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./pages/CreatePost";

const App = () => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate()

  const navigateToSignin = () => {
    navigate('/auth');
  }

  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to={"/auth"} />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to={"/"} />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/posts/:pid" element={<PostPage />} />
      </Routes>
      {user &&
        <LogoutButton />
      }
      {user && <CreatePost />}
    </Container>
  )
}

export default App
