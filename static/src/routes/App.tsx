import React, { Component, createRef, RefObject } from "react";
import Axios from "axios";
import sharedb from "sharedb/lib/client";
import { Socket, io } from "socket.io-client";
import ReconnectingWebSocket from "reconnecting-websocket";
import ToolBar from "components/ToolBar";
import TextBox from "components/TextBox";
import Button from "components/Button";
import IconBtn from "components/IconBtn";
import Modal, { ModalStore, ModalContext } from "components/Modal";

// @ts-ignore
import { SketchField, Tools } from "react-sketch2";

import styles from "./App.module.scss";

let colors = ["#e8772d", "#1ef3f4", "#8fa031", "#d6116d", "#ffca21", "#b86480", "#cd88e8", "#127d6f", "#43411c", "#c3073f", "#66FCF1"];

interface Props {};
interface State {
    tool: string;
    cursors: { [id: string]: { x: number, y: number, color: string, name: string } };
    scale: number;
    previews: Array<{ pos: number, img: string }>;
    pos: number;
    justMoved: string;
    lineColor: string;
    fillColor: string;
    fillEnabled: boolean;
    name: string;
    connected: boolean;
}

let ui: { id: string; username: string; email: string; token: string; };
try { ui = JSON.parse(localStorage.getItem("ui")!); } catch { }

class App extends Component<Props, State> {

    s: Socket;
    sketch: RefObject<any>;
    connection: sharedb.Connection | undefined;
    doc: sharedb.Doc | undefined;
    ui: any;
    suppress: boolean = false;

    constructor(props: Props) {
        super(props);

        let widthScale = (window.innerWidth*0.8)/1920,
			heightScale = ((window.innerHeight-190)*0.9)/1080,
            scale = widthScale < heightScale ? widthScale : heightScale;

        window.name = "";
        this.state = { name: "", tool: Tools.Pencil, cursors: {}, scale, previews: [], pos: 0, justMoved: "", lineColor: "#000000", fillColor: "#000000", fillEnabled: false, connected: true }

        this.s = io("/", { query: { id: get("board") || "" }, path: "/run", transports: ["websocket", "polling"] });
        this.sketch = createRef<any>();

        this.onSketchChange = this.onSketchChange.bind(this);
        this.onResize = this.onResize.bind(this);
        this.addBoard = this.addBoard.bind(this);
        this.deleteBoard = this.deleteBoard.bind(this);
        this.changeBoard = this.changeBoard.bind(this);
        this.submitName = this.submitName.bind(this);
    }

    async submitName() {
        const { name } = this.state;
        const [modalState, setModalState] = this.context;

        if (!name) {
            let { data } = await Axios.get("/api/auth/name");
            window.name = data.name;
        } else {
            window.name = name;
        }
        setModalState({ type: "REMOVE" })
    }

    async componentDidMount() {

        const sketch = this.sketch;
        const { pos, cursors, previews } = this.state;
        const [modalState, setModalState] = this.context;

        let ui: any = localStorage.getItem("ui");
        try { ui = JSON.parse(ui!); } catch {
            genName();
        }

        if (ui && ui.token) {
            Axios.post("/api/auth/verifyToken", { token: ui.token }).then(({ data }) => {
                if (!data.valid) {
                    return genName()
                }
				window.name = ui.username;
                this.setState({ name: ui.username });
            }).catch(() => genName());
            this.ui = ui;
        } else {
            this.ui = {};
            genName();
        }

        async function genName() {
			//let name = prompt("What would you like to be called? (Leave blank for random)");
            setModalState({ id: "name" })
		}

        window.addEventListener("mousemove", e => {
			this.s.emit("cursor", { id: this.s.id, x: e.clientX/window.innerWidth, y: e.clientY/window.innerHeight, name: window.name, posNo: this.state.pos })
		});

		window.addEventListener("keydown", (e) => {
			if (e.keyCode === 8) { sketch.current.removeSelected(); this.onSketchChange(); }
			if ((e.ctrlKey || e.metaKey) && e.key === 'z' && sketch.current.canUndo()) { sketch.current.undo(); }
			if ((e.ctrlKey || e.metaKey) && e.key === 'x' && sketch.current.canRedo()) { sketch.current.redo(); }
		});

		window.addEventListener('resize', this.onResize);

        this.s.on('connect', () => {
            this.setState({ connected: true });
        });

        this.s.on('disconnect', () => {
            this.setState({ connected: false });
        });

        // Handles collaborative cursors
        this.s.on('cursor', ({ id, x, y, name, posNo }) => {

            let cursors = this.state.cursors;
            let color;
			if (this.state.pos !== posNo) { return; }
			if (!cursors[id]) {
				color = colors[Math.floor(Math.random()*10)];
			}
			let posObj: any = {};
			posObj[id] = { ...cursors[id], x: x * window.innerWidth, y: y * window.innerHeight, color: color || cursors[id].color, name };
            this.setState({ cursors: { ...cursors, ...posObj }, justMoved: id });
			setTimeout(() => this.setState({ justMoved: "" }), 10);
        });

        // Deletes cursors if user disconnects
        this.s.on("userdc", id => {
			let c = cursors;
			delete c[id];
			this.setState({ cursors: c });
		});

        this.s.on('previews', async (p) => {
			let newPreviews: any = [];
            let pos = this.state.pos;
			switch (p.type) {
				case 0:
					newPreviews = []

					// Getting ALL
					p.all.forEach(({ pos, img }: { pos: number, img: string }) => {
						newPreviews.push({ pos, img });
					});
					this.setState({ previews: newPreviews });
					
					if (p.all.length - 1 < pos) {
						this.setState({ pos: p.all.length - 1 });
                        this.doc = await this.loadBoard(p.all.length - 1);
					}

					break;
				case 1:
					// Updating ONE
					let index = this.state.previews.findIndex((e) => e.pos === p.pos);
					if (index < 0) return;
					newPreviews = JSON.parse(JSON.stringify(this.state.previews));
					newPreviews[index].img = p.img;
                    console.log(newPreviews);
					this.setState({ previews: newPreviews });
					break;
				case 2:
					// Add ONE
					newPreviews = JSON.parse(JSON.stringify(this.state.previews));
					newPreviews.push({ pos: p.pos, img: p.img });
					this.setState({ previews: newPreviews });
					break;
				default:
					return;
			}
        });

        const ws = new ReconnectingWebSocket(`wss://${window.location.host}/sh`);

        ws.onopen = async () => {
            this.connection = new sharedb.Connection(ws as any);
            this.doc = await this.loadBoard(0);
        }

    }

    componentDidUpdate(props: Props, state: State) {
        if (this.state.fillColor !== state.fillColor || this.state.fillEnabled !== state.fillEnabled) {
            let tool = this.state.tool;
            this.setState({ tool: Tools.Pencil }, () => this.setState({ tool }));
        }
    }

    onResize() {
        let widthScale = (window.innerWidth*0.8)/1920,
			heightScale = ((window.innerHeight-190)*0.9)/1080,
            scale = widthScale < heightScale ? widthScale : heightScale;
        this.setState({ scale });
    }

    async loadBoard(p: number): Promise<sharedb.Doc> {

        if (this.doc) { this.doc.unsubscribe(); }

        let id = (await Axios.post("/api/board/get/canvasId", { boardID: get("board"), pos: p, token: this.ui.token })).data.id;

        let doc = this.connection!.get("canvas_sharedb", id);

        doc.subscribe((err) => {
            if (err) throw err;

            if (doc.type === null) {
                throw new Error("ShareDB document uninitialized. Check if the id is correct and you have initialised the document on the server.");
            }

            console.log("sub");
            this.suppress = true;
            this.sketch.current.fromJSON(doc.data);
            this.suppress = false;
        });

        doc.on('op batch', (ops, source) => {
            if (source) { return; }
            this.suppress = true;
            console.log("op", source);
            this.sketch.current.fromJSON(doc.data);
            this.suppress = false;
        });

        return doc;
    }

    onSketchChange() {

        if (this.suppress) { return; }

        if (!this.doc || !this.doc.data) { return; }

        /*if (sketchState.suppress ||
			JSON.stringify(sketchState.lastSketch) === JSON.stringify(sketch.current.toJSON())) {
				return setSketchState({ ...sketchState, suppress: false });
		}

		if (!sketchState.lastSketch || sketchState.lastSketch.type) { return; }*/

        if (JSON.stringify(this.doc.data.objects) === JSON.stringify(this.sketch.current.toJSON().objects)) { return; }

		let ops = detectChange(this.doc.data, this.sketch.current.toJSON());

        if (ops.length === 0) { return; }

        this.doc?.submitOp(ops, { source: true }, (err) => {
            if (err) throw err;

            this.s.emit("draw", this.state.pos);

            if (this.sketch.current.toJSON().objects.length !== this.doc?.data.objects.length) {
                this.suppress = true;
                this.sketch.current.fromJSON(this.doc?.data);
                this.suppress = false;
            }
        });
	
        /**
         * Detects changes/differences between current sketch state and new sketch state
         * @param c Current sketch.toJSON()
         * @param n New incoming sketch.toJSON() value
         * 
         * Some pointers for myself:
         * - Paths do not change when resized, flipped, color change etc. Paths are always the same
         * - It is possible to make multiple changes to a single object each time this event is fired.
         */
        function detectChange(c: any, n: any) {
            console.log(c, n);
            let [co, no] = [c.objects, n.objects];

            // type = 1 (Created), type = 2 (Deleted), type = 3 (Change)
            let ops: Array<{ p: ["objects", number], li?: any, ld?: any, lm?: any }> = [];

            // Flatten objects (easier to check for equivalence)
            let [cf, nf] = [co.map((a: any) => JSON.stringify(a)), no.map((b: any) => JSON.stringify(b))];

            if (cf.length !== nf.length) {
                if (cf.length > nf.length) {
                    // Object(s) was deleted
                    let deletedItems = 0;
                    for (let i = 0; i < cf.length; i++) {
                        if (cf[i] !== nf[i - deletedItems]) {
                            ops.push({ p: ["objects", i - deletedItems], ld: co[i] });
                            deletedItems += 1;
                        }
                    }
                    /*for (let i = 0; i < cf.length; i++) {
                        if (cf[i] !== nf[i]) {
                            ops.push({ p: ["objects", i], ld: co[i] });
                            cf.splice(i, 1);
                            co.splice(i, 1);
                            i -= 1;
                        }
                    }*/

                } else {
                    // Object(s) was created
                    for (let i = 0; i < nf.length - cf.length; i++) {
                        ops.push({ p: ["objects", cf.length + i], li: no[cf.length + i] });
                    }
                }

            } else {
                // Object(s) was changed
                for (let i = 0; i < cf.length; i++) {
                    if (cf[i] !== nf[i]) {
                        ops.push({ p: ["objects", i], li: no[i], ld: co[i] });
                    }
                }
            }

            return ops;
        }
    }

    addBoard() {
		this.s.emit("addBoard");
	}


    deleteBoard(p: number) {
        this.s.emit("delBoard", p)
    }

    async changeBoard(p: number) {
        this.doc = await this.loadBoard(p);

        this.setState({ pos: p });
    }

    setColor(type: string, color: string) {

        let newState: any = {};
        newState[type] = color;
        this.setState(newState);
    }


    render() {

        const { tool, cursors, pos, previews, scale, justMoved, lineColor, fillColor, fillEnabled, connected } = this.state;
        const sketch = this.sketch;

        return (<div className={styles.page} style={{ height: window.innerHeight }}>
            <div style={{ height: window.innerHeight, display: connected ? 'none' : 'flex' }} className={styles.disconnected}><h1>Disconnected</h1><p>Check your connection.<br />If you believe your connection is stable, try reloading the page.</p></div>
            <NameModal name={this.state.name} onChange={(name) => this.setState({ name })} submit={this.submitName} />
            <ToolBar fillEnabled={this.state.fillEnabled} tool={tool} sketch={sketch} setState={(s) => this.setState(s)} push={(l) => window.location.pathname = l} />
            {Object.keys(cursors).map(id => <div className={`${styles.cursor} ${justMoved === id ? "" : styles.cursorJustMoved}`} style={{ left: cursors[id]?.x, top: cursors[id]?.y }}>
                <div style={{ backgroundColor: cursors[id]?.color }} />
                <span style={{ backgroundColor: cursors[id]?.color }}>{cursors[id]?.name}</span>
            </div>)}
            <div className={styles.editorArea}>
                <div style={{ transform: `scale(${scale})` }}>
                    <SketchField
                        height="1080px"
                        width="1920px"
                        backgroundColor="white"
                        widthCorrection={2}
                        heightCorrection={2}
                        tool={tool}
                        lineColor={lineColor}
                        fillColor={fillEnabled ? fillColor : "transparent"}
                        onChange={this.onSketchChange}
                        ref={sketch} />
                </div>
                { window.name !== "" ? <span>You are: {window.name}</span> : "" }
                <IconBtn icon="download" selected="" value="download" onClick={() => window.open(`/api/board/get/download?boardID=${get("board")}&pos=${pos}`, "_blank")} />
            </div>
            <div className={styles.paneViewer}>
                {previews
                    .sort((a, b) => a.pos > b.pos ? 1 : a.pos < b.pos ? -1 : 0)
                    .map((p) =>
                        <Board
                            img={p.img}
                            selected={pos === p.pos}
                            onClick={() => this.changeBoard(p.pos)}
                            onClose={() => this.deleteBoard(p.pos)} />)
                }
                <div className={styles.pane} onClick={this.addBoard}>
                    <i className="material-icons">add</i>
                </div>
            </div>
        </div>);
    }
}

App.contextType = ModalContext;

function Board({ img, onClick, onClose, selected } : { img: string, onClick: () => void, onClose: () => void; selected: boolean; }) {
	return (<div className={`${styles.board} ${selected ? styles.selectedBoard : ''}`}>
		<div style={{ backgroundImage: `url(${img})` }} onClick={onClick} className={styles.pane} />
		<i className="material-icons" onClick={onClose}>close</i>
	</div>);
}

function NameModal({ name, onChange, submit }: { name: string; onChange: (name: string) => void, submit: () => void }) {
    return (<Modal id="name" hideClose={true}>
        <h1>What would you like to be called?</h1>
        <TextBox placeholder="Name (Leave blank for random)" value={name} onChange={onChange} />
        <Button
            title="Go" icon="navigate_next"
            onClick={submit}
            style={{ borderRadius: 0, width: '100%', marginTop: 20, padding: 5 }} />
    </Modal>)
}

function get(name: string) {
    let url = window.location.href;
    name = name.replace(/[\]]/g, "\\$&");
    let res = (new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")).exec(url);
    if (!res) return null;
    if (!res[2]) return "";
    return decodeURIComponent(res[2].replace(/\+/g, " "));
}

export default () => <ModalStore><App /></ModalStore>;