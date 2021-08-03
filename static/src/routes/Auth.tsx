import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import AuthInput from "components/AuthInput";
import Button from "components/Button";
import { useHistory } from "react-router";

import styles from "./Auth.module.scss";

function Auth() {

    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [type, setType] = useState<"Login" | "Sign Up">("Login");

    const History = useHistory();

    function send() {
        Axios.post(`/api/auth/${type === "Login" ? 'login' : 'signup'}`, {
            u: user,
            e: email,
            p: pass
        }).then(({ data }) => {
            localStorage.setItem("ui", JSON.stringify(data));
            History.push("/dash");
        }).catch(({ response }) => {
            setError(response.data);
        });
    }

    useEffect(() => {
        setUser("");
        setError("");
    }, [type]);

    useEffect(() => {
        let ui: { id: string; username: string; email: string; token: string; };
        try { ui = JSON.parse(localStorage.getItem("ui")!); } catch { return }
        if (ui && ui.token) {
            Axios.post("/api/auth/verifyToken", { token: ui.token }).then(({ data }) => {
                if (data.valid) {
                    History.push("/dash");
                }
            }).catch(console.error);
        }
    }, []);

    return (<div className={styles.bg}>
        <h1>{type}</h1>
        <h3>{ type === "Login" ? "Welcome back, we missed you!" : "Welcome! We just need a few things from you..."}</h3>
        { type === "Sign Up" ? <div className={styles.inputBox}>
            <AuthInput icon="badge" value={user} onChange={setUser} placeholder="User Name" />
        </div> : ""}
        <div className={styles.inputBox}>
            <AuthInput icon="mail" value={email} onChange={setEmail} placeholder="Email Address" />
            <AuthInput icon="password" value={pass} onChange={setPass} placeholder="Password" isPassword={true} />
        </div>
        { type === "Login" ?
            <span>Don't have an account? <u onClick={() => setType("Sign Up")}>Sign up</u></span> :
            <span>Already have an account? <u onClick={() => setType("Login")}>Log in</u></span> }
        {error ?  <span style={{ color: "red", marginTop: 0 }}>{error}</span> : "" }
        <Button title={type} icon="login" onClick={send} style={{ marginTop: 10, width: 200 }} />
        <a onClick={() => History.push("/")} href="/" style={{ position: 'fixed', bottom: 0, left: 0, margin: 20, color: 'grey' }}>Back to Landing</a>
    </div>);
}

export default Auth;