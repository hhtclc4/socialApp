import React, { useContext } from 'react'

import { AuthContext } from '../../context/AuthUser'
import { Redirect } from 'react-router-dom'

const PageShow = () => {
    const { user } = useContext(AuthContext);
    const page = user ?
        (
            // <Redirect to="/" />
            <></>
        ) : (
            <>
                <Redirect to="/login" />
            </>
        )
    return page
}

export default PageShow
