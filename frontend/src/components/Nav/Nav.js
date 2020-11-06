import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthUser'
import './Nav.css'
import userImage from '../../images/defaultava.png'
import { useHistory } from 'react-router-dom'
// import Modal from '../../util/Modal/Modal'
const Nav = () => {
    let { user, logout } = useContext(AuthContext);

    let history = useHistory();

    const logoutPush = () => {
        user = logout();
        history.push('./login');
        console.log(user);
    }
    return (
        user ?
            <div className="nav-container d-flex flex-row justify-content-between align-items-center">
                <div className="logo">logo</div>

                <div className="nav-btn-group d-flex flex-row justify-content-between align-items-center">
                    <img className="user-img" alt="user-img" src={userImage} />
                    <div className="logout-btn" onClick={logoutPush}>Log out</div>
                </div>
            </div> :
            <></>
    )
}

export default Nav
