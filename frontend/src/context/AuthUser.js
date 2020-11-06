import React, { useReducer, createContext } from 'react'

import jwtDecode from 'jwt-decode'
const initialState = {
    user: null,
}
if (localStorage.getItem("Userjwt")) {
    const decodedToken = jwtDecode(localStorage.getItem("Userjwt"));

    if (decodedToken.exp * 1000 < Date.now) {
        localStorage.removeItem("Userjwt")
    } else {
        initialState.user = decodedToken
    }
}
const AuthContext = createContext({
    user: null,
    login: (userData) => { },
    logout: () => { },
})

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return {
                ...state,
                user: action.payload
            }
        }

        case 'LOGOUT': {
            return {
                ...state,
                user: null
            }
        }

        default:
            return state
    }
}

const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (userData) => {
        localStorage.setItem("Userjwt", userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    const logout = () => {
        localStorage.removeItem("Userjwt");

        dispatch({
            type: 'LOGOUT'
        })

    }

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                login,
                logout
            }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }