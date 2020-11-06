import React, { useContext } from 'react'
import './ModalContent.scss'
import { PostCreatorContext } from '../../../components/PostCreator/PostCreator'
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const ModalContent = ({ close, children }) => {
    const { open } = useContext(PostCreatorContext)
    return (
        <div
            style={{
                minWidth: '500px',
                transform: open ? 'translateY(0vh)' : 'translateY(-100vh)',
                opacity: open ? '1' : '0',
                zIndex: open ? '20' : '-1'
            }}

            className="modal-content-container p-3"
        >
            <button className="modal-close-btn" onClick={close}><FontAwesomeIcon icon={faTimes} size="lg" /></button>
            {children}
        </div>
    )
}

export default ModalContent
