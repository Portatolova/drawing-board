import React from "react";
import Button from "components/Button";
import { useHistory } from "react-router";
import styles from "./Landing.module.scss";

function Landing() {

    const History = useHistory();
    
    return (<div className={styles.bg}>
        <h1>Drawing Board</h1>
        <span>Drawings just got<br />a lot more collaborative</span>
        <div className={styles.buttonDiv}>
            <Button title="Get Started" icon="chevron_right" onClick={() => {}} className={styles.getStartedBtn} />
            <Button title="Login" icon="login" onClick={() => History.push("/auth")} className={styles.loginBtn} />
        </div>
    </div>);
}

export default Landing;