import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
const Register = (props) => {
    const [errors, setErrors] = useState({

    });
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }
    const [addUser] = useMutation(REGISTER_USER, {
        update(_, result) {
            console.log(result);
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
        addUser();
    }

    return (
        <div>
            <form onSubmit={onSubmit} noValidate>
                <div className="register-header">
                    Register
                </div>
                <div className="register-body">
                    <div className="register-username">
                        <input type="text"
                            name="username"
                            value={values.username}
                            onChange={onChange}
                        />
                    </div>
                    <div className="register-email">
                        <input type="text"
                            name="email"
                            onChange={onChange}
                            value={values.email}
                        />
                    </div>
                    <div className="register-password">
                        <input type="password"
                            name="password"
                            onChange={onChange}
                            value={values.password}
                        />
                    </div>
                    <div className="register-confirm-password">
                        <input type="password"
                            name="confirmPassword"
                            onChange={onChange}
                            value={values.confirmPassword}
                        />
                    </div>
                </div>
                <div className="register-footer">
                    <button type="submit" className="register-btn">Register</button>
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

const REGISTER_USER = gql`
   mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Register
