import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router";
import Modal, { ModalStore, ModalContext } from "components/Modal";

import styles from "./Profile.module.scss";
import TextBox from "components/TextBox";
import Button from "components/Button";

function Profile() {

    const [ui, setUI] = useState<{ username: "", email: "" }>({ username: "", email: "" });

    const History = useHistory();

    useEffect(() => {
        let ui: any = localStorage.getItem("ui");
        try { ui = JSON.parse(ui!); } catch {
            alert("Your session has expired! Login again to continue.");
            History.push("/auth");
        }

        if (ui && ui.token) {
            Axios.post("/api/auth/verifyToken", { token: ui.token }).then(({ data }) => {
                if (!data.valid) {
                    alert("Your session has expired! Login again to continue.");
                    History.push("/auth");
                }
                setUI({ username: ui.username, email: ui.email });
            }).catch((err) => {
                console.log(err);
                alert("Your session has expired! Login again to continue.");
                History.push("/auth");
            });
        } else {
            History.push("/auth");
        }

    }, []);

    return (<>
        <div className={styles.bg}>
            <header>
                <a href="/" onClick={() => History.push("/")}><h1>Drawing Board</h1></a>
                <a href="/dash" onClick={() => History.push("/dash")}>Dashboard</a>
                <a href="/profile" onClick={() => History.push("/profile")}>Profile</a>
                <a href="/faq" onClick={() => History.push("/faq")}>FAQ</a>
            </header>
            <div>
                <h1>Profile Information</h1>
                <h3>Username:</h3>
                <p>{ui.username}</p>
                <h3>Email:</h3>
                <p>{ui.email}</p>
            </div>
        </div>
        <a href={`/api/auth/logout?token=${JSON.parse(localStorage.ui || "{}")?.token}`} style={{ position: 'fixed', bottom: 0, right: 0, margin: 20, color: 'grey' }}>Logout</a>
    </>);
}

function Board({ name, onClick, id }: { name: string, id: string, onClick: () => void }) {
    return (<div className={styles.board} onClick={onClick}>
        <div style={{ backgroundImage: `url(/api/board/get/preview?boardID=${id}&pos=0)` }} />
        <span>{name}</span>
    </div>);
}

export default () => <ModalStore><Profile /></ModalStore>;