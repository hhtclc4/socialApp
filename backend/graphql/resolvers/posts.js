const Post = require('../../models/Post');
const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');

checkAuth = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId).sort({ createdAt: -1 });
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPostsByUser(_, { userId }) {
            try {
                const posts = await Post.find({ user: userId })
                return posts
            } catch (err) {
                throw new Error('User has no post')
            }
        }
    },

    Mutation: {
        async createPost(_, { body, image, theme }, context) {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            if (image.trim() !== 'none' && theme > 0) {
                throw new Error('Can not use image and theme in one post')
            }
            const newPost = new Post({
                body: body,
                user: user.id,
                username: user.username,
                image: image,
                theme: theme,
                createdAt: new Date().toISOString()
            });

            const posts = await newPost.save();

            return posts;
        },

        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    }
}