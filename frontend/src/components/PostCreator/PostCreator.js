import React, { useState, createContext, useRef, useEffect } from 'react'
import './PostCreator.scss'
import Modal from '../../util/Modal/Modal'
import UserLink from "../../images/defaultava.png"
import { useMutation } from '@apollo/react-hooks';
import ThemeLink from '../../images/theme.png';
import { Input } from 'antd';
import Theme1 from '../../images/Themes/Theme1.png';
import Theme2 from '../../images/Themes/Theme2.png';
import Theme3 from '../../images/Themes/Theme3.png';
import Theme4 from '../../images/Themes/Theme4.png';
import Theme5 from '../../images/Themes/Theme5.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons'
import gql from 'graphql-tag'
import { FETCH_POSTS_QUERY } from '../../util/graphql'
import axios from 'axios';
const cloudinary = require('cloudinary/lib/cloudinary');


const { CLOUD_NAME } = require('../../clould.js')
const { TextArea } = Input;
export const PostCreatorContext = createContext({
    open: false,
    setOpen: () => { }
})


const PostCreator = ({ user }) => {
    const [open, setOpen] = useState(false)
    const value = { open, setOpen }
    const [theme, setTheme] = useState(false)
    const placeholderUser = user ? `Hey ${user.username}, what on your mind? ...` : ``;
    const themeList = [Theme1, Theme2, Theme3, Theme4, Theme5];
    const [selectedTheme, setSelectedTheme] = useState(themeList[0]);
    const [file, setFile] = useState(null);

    const [states, setStates] = useState({
        body: '',
        image: 'none',
        theme: -1
    })

    const handleThemeChange = (theme, index) => {
        setSelectedTheme(theme)
        setStates({
            body: states.body,
            image: 'none',
            theme: index
        })
    }
    const upFileRef = useRef();
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setFile(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);

            //To reset file input
            event.target.value = null;
        }
    }
    const removePickedImage = () => {
        setFile(null);
    }

    const onChange = (event) => {
        setStates({
            body: event.target.value,
            image: 'imageLink',
            theme: -1,
        })
        console.log(states.body);
    }


    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        update(cache, result) {
            //cache to make refresh get Posts
            const existedPosts = cache.readQuery({ query: FETCH_POSTS_QUERY });
            console.log(result.data.createPost);
            const newPosts = existedPosts.getPosts.push(result.data.createPost)
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: newPosts
                }
            })
            states.body = '';
            states.image = 'none';
            states.theme = -1;
        },
        onError() {
            console.log(error);
        },
        onCompleted() {
            setOpen(false)
        }
    })
    const onSubmit = async (event) => {
        event.preventDefault();
        // Get the timestamp in seconds
        // var timestamp = Math.round((new Date).getTime() / 1000);

        // // Show the timestamp
        // console.log('Timestamp:', timestamp);

        // // Get the signature using the Node.js SDK method api_sign_request
        // var signature = cloudinary.utils.api_sign_request({
        //     timestamp: timestamp,
        //     public_id: 'samples'
        // }, "B-BPLmYRO2jRM5f_V1dBW0zOZo4");

        // Show the signature
        // console.log('Signature:', signature);

        // ====================================================================================================

        // Having got the timestamp and signature of the parameters to sign, we can now build the curl command.  

        // URL of the file to upload


        // take image publicId link
        //const formData = new FormData();

        // formData.append('file', file);
        // formData.append('upload_preset', "defaultpreset");
        // // formData.append("api_key", "688812829718727")
        // // formData.append("api_secret", "B-BPLmYRO2jRM5f_V1dBW0zOZo4")
        // // formData.append("public_id", "samples")
        // // formData.append("timestamp", timestamp)
        // // formData.append("signature", signature)

        // const response = await axios.post(
        //     `http://api.cloudinary.com/v1_1/triha/image/upload`,
        //     formData, {
        //     headers: { "Content-Type": "multipart/form-data" }
        // });

        // console.log(response);
        // Build the curl command
        // Show the curl command
        //console.log(curl_command);
        // // createPost();
        // console.log(response);
        // //useMutation
        console.log(states);
        createPost({ variables: { body: states.body, image: states.image, theme: states.theme } });

        // console.log(error.graphQLErrors[0].message)
        // window.scrollTo(0, document.body.scrollHeight);
    }

    return (
        <div className="post-cr-container d-flex flex-row align-items-center px-3 mb-4">
            <div className="post-cr-user mr-3">
                <img alt="user" src={UserLink} />
            </div>
            <button onClick={() => {
                setOpen(!open)
            }}
                className="post-cr-btn p-2 flex-fill text-left"
            >
                What's on your mind?...
            </button>

            {/**Modal */}
            <PostCreatorContext.Provider value={value}>
                <Modal>
                    <form noValidate onSubmit={onSubmit}>
                        <div className="post-cr-hear text-center">
                            <h3>Create Post</h3>
                        </div>
                        <div className="post-cr-body">
                            <div className="post-cr-user py-3">
                                <img alt="user" src={UserLink} />
                            </div>

                            {/**TEXT AREA */}
                            <div className="post-cr-text-editor">
                                <TextArea
                                    style={theme ? {
                                        backgroundImage: `url(${selectedTheme})`, textAlign: 'center', paddingTop: '25%',
                                        color: selectedTheme === Theme5 ? '#fff' : null
                                    } : {}}

                                    autoSize={{ minRows: 6, maxRows: 12 }}
                                    placeholder={placeholderUser}
                                    name="body"
                                    onChange={onChange}
                                    value={states.body}
                                />
                            </div>
                            {/**END TEXT AREA */}

                            {/**IMAGE SHOW*/}
                            <div className="post-cr-img-show" style={file ? { border: '1px solid #d9d9d9', borderRadius: '5px' } : null}>
                                <div className="img-close-btn"
                                    onClick={removePickedImage}
                                ><FontAwesomeIcon icon={faTimes} size="lg" /></div>
                                {file ? <img alt="post" src={file} /> : null}
                            </div>
                            {/**END IMAGE SHOW */}

                            <div className="post-cr-actions d-flex flex-grow py-2">

                                {/**ADD THEME*/}
                                {file ? null :
                                    <div className="post-cr-add-theme d-flex flex-row" >
                                        {theme ? <div className="collapse-btn" onClick={() => {
                                            setTheme(false)
                                            setStates({
                                                body: states.body,
                                                image: 'none',
                                                theme: -1
                                            })
                                        }}>
                                            <FontAwesomeIcon icon={faChevronLeft} color="gray" />
                                        </div> :
                                            <img src={ThemeLink} alt="theme-symbol" onClick={() => {
                                                setTheme(true)
                                                setStates({
                                                    body: states.body,
                                                    image: 'none',
                                                    theme: 0
                                                })
                                            }} />}

                                        {theme ? <div className="post-cr-themes-list d-flex flex-row">
                                            {themeList.map((theme, index) =>
                                                <div
                                                    className="theme-thumb"
                                                    onClick={() => handleThemeChange(theme, index)}
                                                    alt="theme" key={index}
                                                    style={{ backgroundImage: `url(${theme})` }}
                                                ></div>
                                            )}
                                        </div> : null}
                                    </div>}
                                {/** END ADD THEME*/}

                                {/** ADD IMAGE*/}
                                {theme ? null :
                                    <div className="post-cr-add-img ml-3">
                                        <div>
                                            <input className="d-none" ref={upFileRef} type="file" onChange={handleFileChange} />
                                            <FontAwesomeIcon icon={faImage} size="2x" color="#999" onClick={(e) => upFileRef.current.click()} />
                                        </div>
                                    </div>}
                                {/** END ADD IMAGE*/}
                            </div>
                        </div>
                        <div className="post-cr-footer pt-3">
                            <button className="post-cr-post-btn px-3 py-2">Post</button>
                        </div>
                        {error && error.graphQLErrors[0] && <ul><li>{error.graphQLErrors[0].message}</li></ul>}
                    </form>
                </Modal>
            </PostCreatorContext.Provider>
        </div>
    )
}

const CREATE_POST_MUTATION = gql`
   mutation createPost(
        $body: String!
        $image: String!
        $theme: Int!
    ) {
    createPost(
      body: $body
      image: $image
      theme: $theme
    ) {
        id
        body
        createdAt
        username
        image
        theme
        likes {
        id
        username
        createdAt
      }
      likeCount
        comments {
            id
            body
            username
            createdAt
      }
      commentCount
    }
  }
`

export default PostCreator
