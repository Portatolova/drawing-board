import React, { Component, CSSProperties } from "react";
import styles from "./index.module.css";

interface Props {
    placeholder?: string;
    isPassword?: boolean;
    isEnabled?: boolean;
    style?: CSSProperties;
    value?: string;
    type?: string;
    onChange?: (text: string) => void;
    min?: string;
    name?: string;
    required?: boolean;
}

class TextBox extends Component<Props> {
    render() {
        return (<input
            required={this.props.required}
            name={this.props.name}
            type={this.props.isPassword ? "password" : this.props.type || "text"}
            value={this.props.value}
            className={styles.input}
            disabled={this.props.isEnabled === false}
            min={this.props.min}
            onChange={(e) => this.props.onChange?.(e.target.value)}
            style={{
                backgroundColor: this.props.isEnabled !== false ? "" : "lightgrey",
                ...this.props.style }}
            placeholder={this.props.placeholder} />);
    }
}

export default TextBox;