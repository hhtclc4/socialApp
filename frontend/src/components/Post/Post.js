import React, { useContext } from 'react'
import '../Post/Post.scss'
import UserLink from '../../images/defaultava.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { AuthContext } from '../../context/AuthUser';
import gql from 'graphql-tag'
import { FETCH_POSTS_QUERY } from '../../util/graphql'
import { useMutation } from '@apollo/react-hooks'
const ObjectId = require('mongodb').ObjectID
export const Post = ({ body, createdAt, image, theme, username, id, likes, likeCount, comments, commentCount }) => {
    const user = useContext(AuthContext);
    //console.log("type of id is ", typeof (id));
    const [deletePostMutation] = useMutation(DELETE_POST_MUTATION, {
        update(cache) {
            const existedPosts = cache.readQuery({
                query: FETCH_POSTS_QUERY
            });
            const newPosts = existedPosts.getPosts.filter(p => (p.id !== id))
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: { getPosts: newPosts }
            })
        },
        onError(error) {
            console.log(error);
        },
    })

    const handleDelete = () => {
        console.log(id);
        const deletedId = ObjectId(id);
        console.log(typeof (deletedId.id));
        console.log(deletedId);
        deletePostMutation({ variables: { postId: id } })
    }


    return (
        <div className="post-container  d-flex flex-column my-3 p-2">
            <div className="post-header d-flex flex-row align-items-center">
                <div className="post-user-img mr-2 ">
                    <img alt="user" src={UserLink} />
                </div>
                <div className="post-user">{username}</div>
                {
                    user && user.user.username === username &&
                    <div className="post-delete-btn flex-fill d-flex flex-row justify-content-end align-items-center">
                        <span onClick={handleDelete}><FontAwesomeIcon icon={faTrashAlt} size="lg" color="#cc0000" /></span>
                    </div>
                }
            </div>
            <div className="post-body flex-fill">
                <div className="post-body-content">{body}</div>

                <div className="post-body-bg">
                </div>
            </div>
            <div className="post-footer">
                <div className="post-like-comment d-flex flex-row justify-content-between py-1">
                    <div className="post-likes">{likeCount}</div>
                    <div className="post-comments">{commentCount}</div>
                </div>
                <div className="post-actions-btn  d-flex flex-row justify-content-between py-1">
                    <div className="like-btn">Like</div>
                    <div className="comment-btn">Comment</div>
                </div>
                <div className="post-write-comment-field d-flex flex-row py-2 align-items-center">
                    <img alt="user" src={UserLink} />
                    <textarea placeholder="Write comment" />
                </div>
                <div className="post-user-commnents">
                    <div className="post-user-comment d-flex flex-row">
                        <img alt="user" src={UserLink} />
                        <div className="user-comment">
                            <div className="user-comment-name">
                                username
                            </div>
                            <div className="user-comment-body">
                                This is a sample comment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
    
  }
`;


export default Post