const { gql } = require('apollo-server')



module.exports = gql`
  
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        theme: Int!
        image: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
    }

    type Like {
    id: ID!
    createdAt: String!
    username: String!
    }

    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput{
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post
        getPostsByUser(userId: ID!): [Post]
    }

    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username:String!, password:String!): User!
        createPost(body: String!, image: String!, theme:Int!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
`;
