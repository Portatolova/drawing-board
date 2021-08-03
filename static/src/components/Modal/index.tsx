import React, { useContext } from "react";
import Store, { ModalContext as MC } from "./Store";
import styles from "./index.module.scss";

interface Props {
    id: string;
    width?: number;
    hash?: string;
    children: Array<React.ReactNode>;
    hideClose?: boolean;
    onClick?: () => void;
    onClose?: () => void;
}

export const ModalStore = Store;
export const ModalContext = MC;

function Modal({ onClick, width, hash, children, id, onClose, hideClose }: Props) {

    const [modalState, dispatch] = useContext(ModalContext);
    const { modalActions, selected } = modalState;

    let onCloseHandler = () => {
        dispatch({ type: "REMOVE" });
        onClose?.();
        modalActions.onClose();
    }

    return (<>
    <div onClick={onClick}
        style={{ display: selected === id ? '' : 'none' }} 
        className={`${styles.modalWindow} ${selected === id ? styles.shown : ""}`}>
        
        <div style={{ width: width || "" }}>
            {hideClose ? "" : <a id="modalClose" title="Close" onClick={onCloseHandler} className={styles.modalClose} href={hash}>
                <i className="material-icons">
                    close
                </i>
            </a>}
            {children}
        </div>
    </div></>)
}

export default Modal;