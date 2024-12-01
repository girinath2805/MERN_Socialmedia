import { useRecoilValue } from "recoil"
import Signin from "../components/Signin"
import Signup from "../components/Signup"
import authScreenAtom from "../atoms/authAtom"
import ForgotPassword from "../components/ForgotPassword"


const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return (
    <>
      {authScreenState === 'signup' ? <Signup /> : (authScreenState === 'forget-password' ? <ForgotPassword/> : <Signin />)}
    </>
  )
}

export default AuthPage
