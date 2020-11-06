import React, { useContext, useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { AuthContext } from '../context/AuthUser'
const Login = (props) => {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({

    });
    const [values, setValues] = useState({
        username: '',
        password: ''
    })

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data }) {
            console.log(data);
            context.login(data.login);
            props.history.push('/')
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },

        variables: values
    })

    const onSubmit = (event) => {
        event.preventDefault();
        loginUser();
    }

    return (
        <div>
            <form onSubmit={onSubmit} noValidate>
                <div className="register-header">
                    Login
                </div>
                <div className="register-body">
                    <div className="register-username">
                        <input type="text"
                            name="username"
                            value={values.username}
                            onChange={onChange}
                        />
                    </div>
                    <div className="register-password">
                        <input type="password"
                            name="password"
                            onChange={onChange}
                            value={values.password}
                        />
                    </div>
                </div>
                <div className="register-footer">
                    <button type="submit" className="register-btn">Login</button>
                </div>
            </form>
            {Object.keys(errors).length > 0 ? (
                <ul>
                    {Object.values(errors).map((value) => (
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

const LOGIN_USER = gql`
   mutation register(
    $username: String!
    $password: String!
    ) {
    login(
      username: $username
      password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Login
