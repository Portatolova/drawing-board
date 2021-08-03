import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router";
import Modal, { ModalStore, ModalContext } from "components/Modal";

import styles from "./Faq.module.scss";
import TextBox from "components/TextBox";
import Button from "components/Button";

function Faq() {

    const History = useHistory();
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let ui: any = localStorage.getItem("ui");
        try { ui = JSON.parse(ui!); } catch {
            return setLoggedIn(false);
        }

        if (ui && ui.token) {
            Axios.post("/api/auth/verifyToken", { token: ui.token }).then(({ data }) => {
                console.log('a')
                if (!data.valid) {
                    return setLoggedIn(false);
                }
                return setLoggedIn(true);
            }).catch(() => {
                return setLoggedIn(false);
            });
        } else {
            return setLoggedIn(false);
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
                <h1>Frequently Asked Questions</h1>
                
                <h3>Jump to:</h3>
                <ul>
                    <li><a href="#getStarted">How to get started</a></li>
                    <li><a href="#useDrawingBoard">How to use Drawing Board</a></li>
                    <li><a href="#createMultiple">Creating Multiple Boards</a></li>
                    <li><a href="#collaborate">Collaborate on your board</a></li>
                    <li><a href="#feedback">Leave Feedback</a></li>
                </ul>
                
                <h3 id="getStarted">How to get started</h3>
                <p>Follow these instructions to get started on Drawing Board:</p>
                <ol>
                    <li>Create an account. On the Landing page, click the Login button which looks like this:</li>
                    <img src="/assets/faq/loginBtn.png" style={{ width: "200px" }} />
                    <li>Then on the Login/Signup Page, click the Sign Up button at the bottom of the page:</li>
                    <img src="/assets/faq/switchToSignUp.png" style={{ width: "400px" }} />
                    <li>Afterwards, enter in your email address and choose a good username and password. You will then be redirect to the <a href="/dash" onClick={() => History.push("/dash")}>Dashboard</a>.</li>
                    <li>Once on the Dashboard, click the plus button to create your first Board!</li>
                    <img src="/assets/faq/createBoard.png" style={{ width: "300px" }} />
                    <li>You are done! To learn how to use the Board Tools, take a look at <a href="#useDrawingBoard">How to use Drawing Board</a>!</li>
                </ol>
                
                <h3 id="useDrawingBoard">How to use Drawing Board</h3>
                <p>Learn how to use the various tools in Drawing Board to get started on your creative journey!</p>
                <p style={{ marginTop: 0}}>Here is a table of all Tools in Drawing Board and their functions:</p>
                <table>
                    <tr>
                        <th>Tool</th>
                        <th>Function</th>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <img src="/assets/faq/transformTool.png" />
                                <span>Transform</span>
                            </div>
                        </td>
                        <td>
                            <p>Use the Transform Tool to move, resize and flip layers on your drawing board. Simply click on any item on your drawing board, and move, resize or flip as you wish. You can also delete selected items by pressing backspace (Windows) or delete (Mac OS) on your keyboard.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <img src="/assets/faq/drawTool.png" />
                                <span>Pencil</span>
                            </div>
                        </td>
                        <td>
                            <p>Use the Pencil to draw freely on the Drawing Board. Simply hold down click and drag your cursor across the board to create a drawing. If you are on iPad, you can also use the Apple Pencil. This is the default tool.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <img src="/assets/faq/lineTool.png" />
                                <span>Line Tool</span>
                            </div>
                        </td>
                        <td>
                            <p>Use the Line Tool to draw straight lines. Click and hold anywhere on the board to start a line, then release your mouse at any other position to finish drawing the line.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <img src="/assets/faq/rectangleTool.png" />
                                <span>Rectangle Tool</span>
                            </div>
                        </td>
                        <td>
                            <p>Use the Rectangle Tool to draw rectangles. Click and hold anywhere on the board to start drawing a rectangle, then release your mouse at any other position to finish drawing the rectangle.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <img src="/assets/faq/circleTool.png" />
                                <span>Circle Tool</span>
                            </div>
                        </td>
                        <td>
                            <p>Use the Circle Tool to draw circles. Click and hold anywhere on the board to start drawing a circles, then release your mouse at any other position to finish drawing the circle.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <img src="/assets/faq/undoBtn.png" />
                                <span>Undo</span>
                            </div>
                        </td>
                        <td>
                            <p>Use this to Undo the last change made to the board.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <img src="/assets/faq/redoBtn.png" />
                                <span>Redo</span>
                            </div>
                        </td>
                        <td>
                            <p>Use this to Redo a previously Undo-ed action on the board.</p>
                        </td>
                    </tr>
                </table>
                <p>Drawing Board also allows you to change the line and fill colours of what you are drawing. Here are the tools that let you do so:</p>
                <table>
                    <tr>
                        <td><img src="/assets/faq/lineColour.png" style={{ width: 300, filter: 'drop-shadow(0 0 5px grey)' }} /></td>
                        <td>
                            <p>To change the line colour, click on the "Line" text and a colour selector should appear. Use this to select the colour that you desire</p>
                        </td>
                    </tr>
                    <tr>
                        <td><img src="/assets/faq/fillColour.png" style={{ width: 300, filter: 'drop-shadow(0 0 5px grey)' }} /></td>
                        <td>
                            <p>The "Fill" Colour selector works slightly differently from the Line Colour selector. By default, the "Fill" Colour is disabled which results in the fill being transparent. If you want to enable "Fill", click on the checkbox next to the "Fill" label. Then click on the "Fill" Label to choose your desired colour.</p>
                        </td>
                    </tr>
                </table>
                <p>Congratulations! You are now ready to create your first drawing in Drawing Board! To find out more on how to create multiple boards, take a look at <a href="#createMultiple">Creating Multiple Boards</a>!</p>
                
                <h3 id="createMultiple">Creating Multiple Boards</h3>
                <p>Drawing Board allows you to work on multiple different canvases or "boards". To do so, simple click the "+" button at the bottom of the drawing interface:</p>
                <img src="/assets/faq/createCanvas.png" />
                <p>A new board should appear at the bottom of the screen. To switch to it, simply just click on it.</p>
                <p>If you want to delete a board, hover over the board and select the cross "x" icon at the top right. This will delete the board.</p>
                
                <h3 id="collaborate">Collaborating on your board</h3>
                <p>Collaborating on Drawing Board is easier than ever. Simply copy the URL of the page you are on and send it to your partner. All they have to do is click on the link you sent them, and they're in.</p>
                <p>Once your partner joins, you should be able to see their cursor appear as so:</p>
                <img src="/assets/faq/cursor.png" />
                <p>Do take note that your partner's cursor will only appear if both of you are on the same board. The cursor will also disappear after 5 seconds of inactivity to prevent cluttering.</p>

                <h3 id="feedback">Leave Feedback</h3>
                <p>Want to leave a suggestion or feature request for Drawing Board? Fill up the feedback form below!</p>
                <form className={styles.form} method="post" action="/api/postFeedback">
                    <div>
                        <TextBox placeholder="Name" name="name" style={{ marginBottom: 20, width: '30%', marginRight: 20 }} required />
                        <TextBox placeholder="Email Address" name="email" style={{ width: '30%' }} required />
                    </div>
                    <textarea placeholder="Comments or Features" name="comment" style={{ resize: 'none' }} required></textarea>
                    <Button title="Submit" icon="send" style={{ borderRadius: 0, width: 190 }} />
                </form>
            </div>
        </div>
        {isLoggedIn ? <a href={`/api/auth/logout?token=${JSON.parse(localStorage.ui || "{}")?.token}`} style={{ position: 'fixed', bottom: 0, right: 0, margin: 20, color: 'grey' }}>Logout</a> : "" }
    </>);
}

export default () => <ModalStore><Faq /></ModalStore>;