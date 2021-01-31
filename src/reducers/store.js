import { combineReducers, applyMiddleware, createStore } from "redux";
import { createLogger } from 'redux-logger'
import throttle from "lodash.throttle";

import seed from "./seed";

const logger = createLogger({
    diff: true,
});

const main = (state = { boards: [] }, action) => {
    console.log('action', action.payload)
    switch (action.type) {
    case "ADD_BOARD": {
        const { boardId, boardTitle } = action.payload;
        return { boards: [...state.boards, {boardId: boardId, boardTitle: boardTitle}] };
    }
    case "DELETE_BOARD": {
        const { boardId } = action.payload;
        const filterDeleted = tmpBoard => tmpBoard.boardId !== boardId;
        const newBoards = state.boards.filter(filterDeleted);
        return { boards: newBoards };
    }
    default:
        return state;
    }
};

const boardsById = (state = { lists: [] }, action) => {
    switch (action.type) {
    case "ADD_BOARD": {
        const { boardId, boardTitle } = action.payload;
        return {
        ...state,
        [boardId]: { _id: boardId, title: boardTitle, lists: [] }
        };
    }
    case "CHANGE_BOARD_TITLE": {
        const { boardId, boardTitle } = action.payload;
        return {
        ...state,
        [boardId]: { ...state[boardId], title: boardTitle }
        };
    }
    case "DELETE_BOARD": {
        const { boardId } = action.payload;
        const { [boardId]: deletedBoard, ...restOfBoards } = state;
        console.log('boardsById', restOfBoards)

        return restOfBoards;
    }
    case "ADD_LIST": {
        const { boardId, listId } = action.payload;

        return {
        ...state,
        [boardId]: { ...state[boardId], lists: [...state[boardId].lists, listId] }
        };
    }
    case "MOVE_LIST": {
        const {
        oldListIndex,
        newListIndex,
        sourceBoardId,
        destBoardId
        } = action.payload;
        if (sourceBoardId === destBoardId) {
        const newLists = Array.from(state[sourceBoardId].lists);
        const [removedList] = newLists.splice(oldListIndex, 1);
        newLists.splice(newListIndex, 0, removedList);
        return {
            ...state,
            [sourceBoardId]: { ...state[sourceBoardId], lists: newLists }
        };
        }
        const sourceLists = Array.from(state[sourceBoardId].lists);
        const [removedList] = sourceLists.splice(oldListIndex, 1);
        const destinationLists = Array.from(state[destBoardId].lists);
        destinationLists.splice(newListIndex, 0, removedList);
        return {
        ...state,
        [sourceBoardId]: { ...state[sourceBoardId], lists: sourceLists },
        [destBoardId]: { ...state[destBoardId], lists: destinationLists }
        };
    }
    case "DELETE_LIST": {
        const { listId: deletedListId, boardId } = action.payload;
        const filterDeleted = listId => listId !== deletedListId;
        return {
        ...state,
        [boardId]: {
            ...state[boardId],
            lists: state[boardId].lists.filter(filterDeleted)
        }
        };
    }
    default:
        return state;
    }
};

const listsById = (state = {}, action) => {
    switch (action.type) {
    case "ADD_LIST": {
        const { listId, listTitle } = action.payload;
        return {
        ...state,
        [listId]: { _id: listId, title: listTitle, cards: [] }
        };
    }
    case "CHANGE_LIST_TITLE": {
        const { listId, listTitle } = action.payload;
        return {
        ...state,
        [listId]: { ...state[listId], title: listTitle }
        };
    }
    case "DELETE_LIST": {
        const { listId } = action.payload;
        const { [listId]: deletedList, ...restOfLists } = state;
        return restOfLists;
    }
    case "ADD_CARD": {
        const { listId, cardId } = action.payload;
        return {
        ...state,
        [listId]: { ...state[listId], cards: [...state[listId].cards, cardId] }
        };
    }
    case "MOVE_CARD": {
        const {
        oldCardIndex,
        newCardIndex,
        sourceListId,
        destListId
        } = action.payload;
        if (sourceListId === destListId) {
        const newCards = Array.from(state[sourceListId].cards);
        const [removedCard] = newCards.splice(oldCardIndex, 1);
        newCards.splice(newCardIndex, 0, removedCard);
        return {
            ...state,
            [sourceListId]: { ...state[sourceListId], cards: newCards }
        };
        }
        const sourceCards = Array.from(state[sourceListId].cards);
        const [removedCard] = sourceCards.splice(oldCardIndex, 1);
        const destinationCards = Array.from(state[destListId].cards);
        destinationCards.splice(newCardIndex, 0, removedCard);
        return {
        ...state,
        [sourceListId]: { ...state[sourceListId], cards: sourceCards },
        [destListId]: { ...state[destListId], cards: destinationCards }
        };
    }
    case "DELETE_CARD": {
        const { cardId: deletedCardId, listId } = action.payload;
        const filterDeleted = cardId => cardId !== deletedCardId;
        return {
        ...state,
        [listId]: {
            ...state[listId],
            cards: state[listId].cards.filter(filterDeleted)
        }
        };
    }
    default:
        return state;
    }
};

const cardsById = (state = {}, action) => {
    switch (action.type) {
    case "ADD_CARD": {
        const { cardText, cardId } = action.payload;
        return { ...state, [cardId]: { text: cardText, _id: cardId } };
    }
    case "CHANGE_CARD_TEXT": {
        const { cardText, cardId } = action.payload;
        return { ...state, [cardId]: { ...state[cardId], text: cardText } };
    }
    case "DELETE_CARD": {
        const { cardId } = action.payload;
        const { [cardId]: deletedCard, ...restOfCards } = state;
        return restOfCards;
    }
    case "DELETE_LIST": {
        const { cards: cardIds } = action.payload;
        return Object.keys(state)
        .filter(cardId => !cardIds.includes(cardId))
        .reduce(
            (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
            {}
        );
    }
    default:
        return state;
    }
};

const reducers = combineReducers({
    main,
    boardsById,
    listsById,
    cardsById
});

const saveState = state => {
    try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
    } catch {
    }
};

const loadState = () => {
    try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
        return undefined;
    }
    return JSON.parse(serializedState);
    } catch (err) {
    return undefined;
    }
};

const persistedState = loadState();
const store = createStore(reducers, persistedState, applyMiddleware(logger));

store.subscribe(
    throttle(() => {
    saveState(store.getState());
    }, 1000)
);

if (!store.getState().main.boards.length) {
console.log("SEED");
seed(store);
}

export default store;