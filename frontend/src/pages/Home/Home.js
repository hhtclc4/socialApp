import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import Post from '../../components/Post/Post'
import './Home.scss'
import PostCreator from '../../components/PostCreator/PostCreator'
import { AuthContext } from '../../context/AuthUser'
const Home = () => {

  const { user } = useContext(AuthContext);
  console.log(user);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  console.log(data)

  return (
    <div className="home-container">
      <PostCreator user={user} />
      {loading ? <>Loading...</> :
        data.getPosts.map((post) => (<Post key={post.id} {...post} />))
      }
    </div>
  )
}

const FETCH_POSTS_QUERY = gql`
{
  getPosts {
    id
    body
    createdAt
    username
    likeCount
    theme
    image
      likes {
        username
      }
    commentCount
      comments {
        id
        username
        createdAt
        body
      }
  }
}
`;
export default Home


