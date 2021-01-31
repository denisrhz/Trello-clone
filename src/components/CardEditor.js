import "../styles/CardEditor.css";

import React, { Component } from "react";
import TextareaAutosize from "react-textarea-autosize";
import EditButtons from "./EditButtons";
import PropTypes from 'prop-types';

class CardEditor extends Component {

    constructor(props) {
        super(props);
        this.state = { text: this.props.text || "" };
    }

handleChangeText = event => this.setState({ text: event.target.value });

onEnter = e => {
    const { text } = this.state;

    if (e.keyCode === 13) {
    e.preventDefault();
    this.props.onSave(text);
    }
};

render() {
    const { text } = this.state;
    const { onSave, onCancel, onDelete, adding } = this.props;

    return (
    <div className="Edit-Card">
        <div className="Card">
        <TextareaAutosize
            autoFocus
            className="Edit-Card-Textarea"
            placeholder="Enter the text for this card..."
            value={text}
            onChange={this.handleChangeText}
            onKeyDown={this.onEnter}
        />
        </div>
        <EditButtons
        handleSave={text ? () => onSave(text) : () => ( null )}
        saveLabel={adding ? "Add card" : "Save"}
        handleDelete={onDelete}
        handleCancel={onCancel}
        />
    </div>
    );
}
}

CardEditor.propTypes = {
    text: PropTypes.string
};

export default CardEditor;