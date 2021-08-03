import React from "react";
import styles from "./index.module.scss";

interface Props {
    icon: string;
    selected: string;
    value: string;
    onClick: (type: string) => void;
}

function IconBtn({ icon, selected, value, onClick }: Props) {
	return (<>
        <i className={`material-icons ${selected === value ? styles.selected : ""}`} onClick={() => onClick(value)}>{icon}</i>
    </>);
}

export default IconBtn;
