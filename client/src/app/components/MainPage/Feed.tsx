import Post from "./Post"
import { Record, User } from "../types";

interface FeedProps {
  posts: Record[]; // The Feed component expects an array of Record objects
  user: User
}

const Feed: React.FC<FeedProps> = ({ posts, user }) => {
  
  return (
    <div className=''>
      {posts.map((post) => (
        <Post key={post.id} post={post} user={user}/>
      ))}
    </div>
  )
}

export default Feed