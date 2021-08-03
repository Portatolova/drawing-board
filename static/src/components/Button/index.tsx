import React, { CSSProperties } from "react";

import styles from "./index.module.scss";

interface Props {
    title: string;
    icon: string;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
    onClick?: () => void;
}

function Button({ onClick, title, icon, style, className, disabled }: Props) {

    return (<button className={`${styles.btn} ${className}`} disabled={disabled} onClick={onClick} style={style} >
        <span>{title}</span>
        <div><i className="material-icons">{icon}</i></div>
    </button>);
}

export default Button;