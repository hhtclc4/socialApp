import React, { useContext } from 'react'

import ModalContent from './ModalContent/ModalContent'

import { PostCreatorContext } from '../../components/PostCreator/PostCreator'
const Modal = ({ children }) => {
    const { open, setOpen } = useContext(PostCreatorContext)

    const closeModalHandler = () => {
        setOpen(false);
    }
    return (
        <>
            {open ? <div className="modal-back-drop" onClick={closeModalHandler}></div> : null}
            <ModalContent close={closeModalHandler}>
                {children}
            </ModalContent>

        </>
    )
}

export default Modal
