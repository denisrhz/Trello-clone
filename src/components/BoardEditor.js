import "../styles/BoardEditor.css";

import React, { Component } from "react";
import TextareaAutosize from "react-textarea-autosize";
import PropTypes from 'prop-types';

class BoardEditor extends Component {
ref = React.createRef();

onEnter = e => {
    if (e.keyCode === 13) {
    e.preventDefault();
    this.props.saveBoard();
    }
};

handleClick = e => {
    const node = this.ref.current;

    if (node.contains(e.target)) {
    return;
    }
};

componentDidMount() {
    document.addEventListener("click", this.handleClick, false);
}

componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, false);
}

render() {
    const { title, handleChangeTitle, deleteBoard } = this.props;

    return (
    <div className="Board-Title-Edit" ref={this.ref}>
        <TextareaAutosize
        autoFocus
        className="Board-Title-Textarea"
        placeholder="Enter board title..."
        value={title}
        onChange={handleChangeTitle}
        onKeyDown={this.onEnter}
        style={{ width: deleteBoard ? 220 : 245 }}
        />
        {deleteBoard && <ion-icon name="trash" onClick={deleteBoard} />}
    </div>
    );
}
}

BoardEditor.propTypes = {
    board: PropTypes.object,
    title: PropTypes.string
};

export default BoardEditor;