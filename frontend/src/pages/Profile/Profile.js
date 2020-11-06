import React from 'react'
import './Profile.scss'

const Profile = () => {
    return (
        <>
            <div className="pro-header">
                <div className="pro-info">
                    <div className="pro-ava"></div>
                    <div className="pro-username">Alo</div>
                    <div className="pro-status"></div>
                </div>
            </div>
            <div className="pro-body">
                <div className="pro-post-creator"></div>
                <div className="pro-posts"></div>
            </div>
        </>
    )
}

export default Profile
