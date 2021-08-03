import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router";
import Modal, { ModalStore, ModalContext } from "components/Modal";

import styles from "./Dashboard.module.scss";
import TextBox from "components/TextBox";
import Button from "components/Button";

function Dashboard() {

    const [isCreating, setCreating] = useState(false);
    const [newProjName, setNewProjName] = useState("");
    const [error, setError] = useState("");
    const [boards, setBoards] = useState<Array<any>>([]);

    const History = useHistory();
    const [modalState, setModalState] = useContext(ModalContext);

    useEffect(() => {
        let ui: any = localStorage.getItem("ui");
        try { ui = JSON.parse(ui!); } catch {
            alert("Your session has expired! Login again to continue.");
            History.push("/auth");
        }

        if (ui && ui.token) {
            Axios.post("/api/auth/verifyToken", { token: ui.token }).then(({ data }) => {
                console.log('a')
                if (!data.valid) {
                    alert("Your session has expired! Login again to continue.");
                    History.push("/auth");
                }
            }).catch(() => {
                alert("Your session has expired! Login again to continue.");
                History.push("/auth");
            });
        } else {
            History.push("/auth");
        }

        getBoards();

    }, []);

    useEffect(() => {
        if(!modalState.selected) { setNewProjName(""); setError("") }
    }, [modalState]);

    function createBoard() {
        if (isCreating) { return; }
        if (!newProjName) {
            return setError("Please give your new board a name.")
        } else {
            setError("");
        }

        let ui: any = localStorage.getItem("ui");
        try { ui = JSON.parse(ui!); } catch {
            alert("Your session has expired! Login again to continue.");
            History.push("/auth");
        }

        setCreating(true);

        Axios.post("/api/board/create/board", {
            token: ui.token,
            name: newProjName
        }).then(({ data }) => {
            console.log(data);
            setCreating(false);
            getBoards();
            setModalState({ id: "" });
        }).catch(({ response }) => {
            setCreating(false);
            return setError(response.data);
        });
    }

    function getBoards() {
        let ui: any = localStorage.getItem("ui");
        try { ui = JSON.parse(ui!); } catch {
            alert("Your session has expired! Login again to continue.");
            History.push("/auth");
        }

        if(!ui || !ui.token) { return; }

        Axios.post("/api/board/get/boards", {
            token: ui.token
        }).then(({ data }) => {
            setBoards(data);
        }).catch(({ response }) => setError(response.data));
    }

    return (<>
        <div className={styles.bg}>
            <header>
                <a href="/" onClick={() => History.push("/")}><h1>Drawing Board</h1></a>
                <a href="/dash" onClick={() => History.push("/dash")}>Dashboard</a>
                <a href="/profile" onClick={() => History.push("/profile")}>Profile</a>
                <a href="/faq" onClick={() => History.push("/faq")}>FAQ</a>
            </header>
            <div>
                <div>
                    <span>Your Boards</span>
                    <i className="material-icons" onClick={() => setModalState({ id: "create" })}>add</i>
                </div>
                <div className={styles.boardHolder}>
                    {boards.map((b) => <Board id={b.id} onClick={() => History.push(`/app?board=${b.id}`)} name={b.name} />)}
                    {boards.length === 0 ? <p>No boards found. Create one using the + button!</p> : ""}
                </div>
            </div>
        </div>
        <Modal id="create">
            <h1>Create Board</h1>
            <TextBox placeholder="Name" value={newProjName} onChange={setNewProjName} />
            <span style={{ color: 'red', margin: '20px 0', float: 'left' }}>{error}</span>
            <Button
                title="Create" icon="add"
                onClick={createBoard}
                style={{ borderRadius: 0, width: '100%', marginTop: 20, padding: 5 }} />
        </Modal>
        <a href={`/api/auth/logout?token=${JSON.parse(localStorage.ui || "{}")?.token}`} style={{ position: 'fixed', bottom: 0, right: 0, margin: 20, color: 'grey' }}>Logout</a>
    </>);
}

function Board({ name, onClick, id }: { name: string, id: string, onClick: () => void }) {
    return (<div className={styles.board} onClick={onClick}>
        <div style={{ backgroundImage: `url(/api/board/get/preview?boardID=${id}&pos=0)` }} />
        <span>{name}</span>
    </div>);
}

export default () => <ModalStore><Dashboard /></ModalStore>;