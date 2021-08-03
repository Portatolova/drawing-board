import React, { Component, CSSProperties } from "react";
import styles from "./index.module.css";

interface Props {
    isEnabled: boolean;                      // Can Tick State Change
    isTicked: boolean;                       // Current Tick State
    title: string;                           // Text description of the check box
    onChange(newTickStatus: boolean): void;  // Ran everytime checkbox is clicked AND isEnabled == true.

    checkBoxStyles?: CSSProperties;          // Optional style customisation.
}

class CheckBox extends Component<Props> {
    render() {
        let isMobilePortrait = window.orientation === 0;
        return (
            <div
              onClick={() => this.props.isEnabled ? this.props.onChange(!this.props.isTicked) : ""} 
              className={styles.CheckBox}
              style={{
                ...this.props.checkBoxStyles,
                color: this.props.isEnabled ? "black" : "grey",
                cursor: this.props.isEnabled ? "pointer" : "not-allowed",
              }}>
              <i className="material-icons">
                {this.props.isTicked
                  ? "check_box"
                  : "check_box_outline_blank"}
              </i>
              <span style={{ marginLeft: 10, fontSize: isMobilePortrait ? 16 : 18 }}>
                {this.props.title}
              </span>
            </div>)
    }
}

export default CheckBox;