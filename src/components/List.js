import "../styles/List.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import Card from "./Card";

import CardEditor from "./CardEditor";

import shortid from "shortid";

import ListEditor from "./ListEditor";

import { Droppable, Draggable } from "react-beautiful-dnd";

class List extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            editingTitle: false,
            title: this.props.list.title,
            addingCard: false
        };
    }
    
    toggleAddingCard = () =>
    this.setState({ addingCard: !this.state.addingCard });

    addCard = async cardText => {
        const { listId, dispatch } = this.props;

    this.toggleAddingCard();

    const cardId = shortid.generate();

    dispatch({
    type: "ADD_CARD",
    payload: { cardText, cardId, listId }
    });
    };

    toggleEditingTitle = () =>
    this.setState({ editingTitle: !this.state.editingTitle });

    handleChangeTitle = e => this.setState({ title: e.target.value });

    editListTitle = async () => {
    const { listId, dispatch } = this.props;
    const { title } = this.state;

    this.toggleEditingTitle();

    dispatch({
        type: "CHANGE_LIST_TITLE",
        payload: { listId, listTitle: title }
    });
    };

    deleteList = async () => {
    const { listId, list, dispatch, boardId } = this.props;
    dispatch({
        type: "DELETE_LIST",
        payload: { listId, cards: list.cards, boardId: boardId }
    });
    };

    render() {
        const { list, index } = this.props;
        const { editingTitle, addingCard, title } = this.state;

        return (
        
        <Draggable draggableId={list._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                className="List">
                {editingTitle ? (
                    <ListEditor
                        list={list}
                        title={title}
                        handleChangeTitle={this.handleChangeTitle}
                        saveList={this.editListTitle}
                        onClickOutside={this.editListTitle}
                        deleteList={this.deleteList}
                    />
                    ) : (
                    <div className="List-Title" onClick={this.toggleEditingTitle}>
                        {list.title}
                    </div>
                    )}


                <Droppable droppableId={list._id}>
                {(provided, _snapshot) => (
                    <div ref={provided.innerRef}>
                    {list.cards &&
                        list.cards.map((cardId, index) => (
                        <Card
                            key={cardId}
                            cardId={cardId}
                            index={index}
                            listId={list._id}
                        />
                        ))}

                    {provided.placeholder}
                    </div>
                )}
                </Droppable>

    {addingCard ? (
                <CardEditor
                    onSave={this.addCard}
                    onCancel={this.toggleAddingCard}
                    adding
                />
                ) : (
                <div className="Toggle-Add-Card" onClick={this.toggleAddingCard}>
                    <ion-icon name="add" /> Add a card
                </div>
                )}
            </div>
            )}
        </Draggable>
        );
    }
}

List.propTypes = {
    boardId: PropTypes.string,
    listId: PropTypes.string,
    list: PropTypes.object,
    index: PropTypes.number
};

const mapStateToProps = (state, ownProps) => ({
    list: state.listsById[ownProps.listId]
    });

export default connect(mapStateToProps)(List);