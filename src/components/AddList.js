import "../styles/AddList.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import ListEditor from "./ListEditor";
import shortid from "shortid";
import EditButtons from "./EditButtons";
import PropTypes from 'prop-types';

class AddList extends Component {

    constructor(props) {
        super(props);
        this.state = { title: "" };
    }

handleChangeTitle = e => this.setState({ title: e.target.value });

createList = async () => {
    const { title } = this.state;
    const {boardId, dispatch } = this.props;

    this.props.toggleAddingList();

    dispatch({
        type: "ADD_LIST",
        payload: {
        boardId: boardId,
        listId: shortid.generate(),
        listTitle: title
        }
    });
};

render() {
    const { toggleAddingList } = this.props;
    const { title } = this.state;

    return (
    <div className="Add-List-Editor">
        <ListEditor
        title={title}
        handleChangeTitle={this.handleChangeTitle}
        onClickOutside={toggleAddingList}
        saveList={this.createList}
        />

        <EditButtons
        handleSave={ title ? this.createList : () => ( null )}
        saveLabel={"Add list"}
        handleCancel={toggleAddingList}
        />
    </div>
    );
}
}

AddList.propTypes = {
    boardId: PropTypes.func,
    toggleAddingList: PropTypes.func
};

export default connect()(AddList);