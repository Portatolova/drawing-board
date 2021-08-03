import React from "react";

import styles from "./index.module.scss";

interface Props {
    placeholder: string;
    value?: string;
    onChange?: (text: string) => void;
    isPassword?: boolean;
    icon?: string;
}

function AuthInput({ placeholder, isPassword, onChange, value, icon }: Props) {
    return (<div className={`${styles.outer} ${value ? styles.hasValue : ""}`}>
        <span>{ placeholder }</span>
        <input value={value} type={isPassword ? 'password' : 'text'} onChange={(e) => onChange?.(e.target.value)} />
        <i className="material-icons">{icon}</i>
    </div>)
}

export default AuthInput;