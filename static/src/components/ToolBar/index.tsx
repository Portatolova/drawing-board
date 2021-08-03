import React from "react";
import IconBtn from "../IconBtn";
import CheckBox from "components/CheckBox";

import styles from "./index.module.scss";

// @ts-ignore
import { Tools } from "react-sketch2";

interface Props {
    setState: (state: any) => void;
    tool: string;
    fillEnabled: boolean;
    sketch: any;
    push: (t: string) => void;
}

function ToolBar({ setState, tool, sketch, push, fillEnabled }: Props) {

    return (<>
        <div className={styles.iconBar} style={{ backgroundColor: '#2B2D42', width: '100%', height: 40, color: 'white' }}>
            <h1><a href="/dash" onClick={() => push("/dash")}>Drawing Board</a></h1>
            <span><a href="/faq" onClick={() => push("/dash")}>FAQ</a></span>
            <IconBtn
                value={Tools.Select}
                onClick={(tool) => setState({ tool })}
                selected={tool}
                icon="open_with" />
            {/*<IconBtn
            value={Tools.Pan}
            onClick={setTool}
            selected={tool}
            icon="pan_tool" />*/}
            <IconBtn
                value={Tools.Pencil}
                onClick={(tool) => setState({ tool })}
                selected={tool}
                icon="edit" />
            <IconBtn
                value={Tools.Line}
                onClick={(tool) => setState({ tool })}
                selected={tool}
                icon="show_chart" />
            <IconBtn
                value={Tools.Rectangle}
                onClick={(tool) => setState({ tool })}
                selected={tool}
                icon="crop_square" />
            <IconBtn
                value={Tools.Circle}
                onClick={(tool) => setState({ tool })}
                selected={tool}
                icon="radio_button_unchecked" />
            {/*<IconBtn
                value={"Text"}
                onClick={() => { sketch.current?.addText("Write Here"); setState({ tool: Tools.Select }); }}
                selected={tool}
                icon="title" />*/}
            <i className="material-icons" onClick={sketch.current?.undo}>undo</i>
            <i className="material-icons" onClick={sketch.current?.redo}>redo</i>
        </div>
        <div className={styles.iconBar} style={{ color: 'black' }}>
            <div className={styles.colorInput}>
                <label htmlFor="lineColour">Line</label>
                <input type="color" id="lineColour" onChange={(e) => setState({ lineColor: e.target.value })} />
            </div>
            <div className={styles.colorInput}>
                <label htmlFor="fillColour">Fill</label>
                <input type="color" id="fillColour" onChange={(e) => setState({ fillColor: e.target.value })} />
            </div>
            <CheckBox isEnabled={true} title="" isTicked={fillEnabled} onChange={() => setState({ fillEnabled: !fillEnabled })} />
        </div>
    </>)
}

export default ToolBar;