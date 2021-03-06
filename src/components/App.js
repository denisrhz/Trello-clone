import { Link } from "react-router-dom";

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import AddBoard from "./AddBoard";

import "../styles/App.css";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { addingBoard: false };
    }

    toggleAddingBoard = () =>
    this.setState({ addingBoard: !this.state.addingBoard });

render() {

    const { main } = this.props;
    const { addingBoard } = this.state;

        return (
            <div className="App">
                {main.boards.map((board, index) => {
                    return <Link className="Board-Link" to={"/" + board.boardId}>
                        {board.boardTitle}
                    </Link>;
                })}
        
            <div className="Add-Board">
                    {addingBoard ? (
                        <AddBoard toggleAddingBoard={this.toggleAddingBoard}/>
                    ) : (
                        <div onClick={this.toggleAddingBoard} className="Add-Board-Button">
                        <ion-icon name="add" /> Add a board
                        </div>
                    )}
                </div>
        
            </div>
            );
}
}

App.propTypes = {
    main: PropTypes.object
};

const mapStateToProps = state => ({ main: state.main });

export default connect(mapStateToProps)(App);

