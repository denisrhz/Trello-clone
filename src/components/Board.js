import React, { Component } from "react";
import { connect } from "react-redux";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import BoardEditor from "./BoardEditor";
import List from "./List";
import AddList from "./AddList";
import PropTypes from 'prop-types';

import { Redirect } from "react-router-dom";

import "../styles/Board.css";

class Board extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            editingTitle: false,
            title: this.props.board.title || NaN,
            addingList: false
        };
    }

    toggleEditingTitle = () => this.setState({ editingTitle: !this.state.editingTitle });

    handleChangeTitle = e => this.setState({ title: e.target.value });

    editBoardTitle = async () => {
        const { boardId, dispatch } = this.props;
        const { title } = this.state;

        this.toggleEditingTitle();

        dispatch({
            type: "CHANGE_BOARD_TITLE",
            payload: { boardId, boardTitle: title }
        });
    };

    deleteBoard = async () => {
        const { boardId, dispatch } = this.props;

        dispatch({
            type: "DELETE_BOARD",
            payload: { boardId }
        });
    };

    toggleAddingList = () =>
        this.setState({ addingList: !this.state.addingList });

    handleDragEnd = ({ source, destination, type }) => {
        // dropped outside the allowed zones
        if (!destination) return;
    
        const { dispatch } = this.props;

        // Move list
        if (type === "COLUMN") {
        // Prevent update if nothing has changed
        if (source.index !== destination.index) {
            dispatch({
            type: "MOVE_LIST",
            payload: {
                sourceBoardId: source.droppableId,
                destBoardId: destination.droppableId,
                oldListIndex: source.index,
                newListIndex: destination.index
            }
            });
        }
        return;
        }

        if (
            source.index !== destination.index ||
            source.droppableId !== destination.droppableId
        ) {
            dispatch({
            type: "MOVE_CARD",
            payload: {
                sourceListId: source.droppableId,
                destListId: destination.droppableId,
                oldCardIndex: source.index,
                newCardIndex: destination.index
            }
            });
        }
    };

render() {
    
    const board = this.props.board;
    const { editingTitle, addingList, title } = this.state;

    return (
        <div>
            { !board ? (<Redirect to='/'/>) : (<>
                {editingTitle ? (
                    <BoardEditor
                        board={board}
                        title={title}
                        handleChangeTitle={this.handleChangeTitle}
                        saveBoard={title ? this.editBoardTitle : () => ( null )}
                        onClickOutside={this.editBoardTitle}
                        deleteBoard={this.deleteBoard}
                    />
                    ) : (
                    <div className="Board-Title" onClick={this.toggleEditingTitle}>
                        {board.title}
                    </div>
                )}
            <DragDropContext onDragEnd={this.handleDragEnd}>
                <Droppable droppableId={board._id} direction="horizontal" type="COLUMN">
                {(provided, _snapshot) => (
                    <div className="Board" ref={provided.innerRef}>
            {board.lists.map((listId, index) => {
                return <List listId={listId} key={listId} boardId={board._id} index={index} />;
            })}

            {provided.placeholder}

            <div className="Add-List">
                {addingList ? (
                    <AddList toggleAddingList={this.toggleAddingList} boardId={board._id} />
                ) : (
                    <div onClick={this.toggleAddingList} className="Add-List-Button">
                    <ion-icon name="add" /> Add a list
                    </div>
                )}
            </div>
        </div>
        )}
            </Droppable>
        </DragDropContext>
        </>)
        }
        </div>
    );
};
}

BoardEditor.propTypes = {
    board: PropTypes.object,
    boardId: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
board: state.boardsById[ownProps.boardId]
});

export default connect(mapStateToProps)(Board);