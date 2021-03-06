import "../styles/AddBoard.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import BoardEditor from "./BoardEditor";
import shortid from "shortid";
import EditButtons from "./EditButtons";
import PropTypes from 'prop-types';

class AddBoard extends Component {

    constructor(props) {
        super(props);
        this.state = { title: "" };
    }

handleChangeTitle = e => this.setState({ title: e.target.value });

createBoard = async () => {
    const { title } = this.state;
    const { dispatch } = this.props;

    this.props.toggleAddingBoard();

        dispatch({
            type: "ADD_BOARD",
            payload: { boardId: shortid.generate(), boardTitle: title }
        });
};

render() {
    const { toggleAddingBoard } = this.props;
    const { title } = this.state;

    return (
    <div className="Add-Board-Editor">
        <BoardEditor
        title={title}
        handleChangeTitle={this.handleChangeTitle}
        onClickOutside={toggleAddingBoard}
        saveBoard={this.createBoard}
        />

        <EditButtons
        handleSave={ title ? this.createBoard : () => ( null )}
        saveLabel={"Add board"}
        handleCancel={toggleAddingBoard}
        />
    </div>
    );
}
}

AddBoard.propTypes = {
    toggleAddingBoard: PropTypes.func
};

export default connect()(AddBoard);