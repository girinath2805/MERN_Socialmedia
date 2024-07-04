import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={1200} replies={500} postImg = {'/post1.png'} postTitle={"Let's talk about threads"}/>
      <UserPost likes={1200} replies={500} postImg = {'/post1.png'} postTitle={"Let's talk about threads"}/>
      <UserPost likes={1200} replies={500} postTitle={"Let's talk about threads"}/>
    </>
  )
}

export default UserPage