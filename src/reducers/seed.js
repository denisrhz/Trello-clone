import shortid from "shortid";

export default store => {
const firstBoardId = shortid.generate();

store.dispatch({
    type: "ADD_BOARD",
    payload: { boardId: firstBoardId, boardTitle: "First board" }
});

const firstListId = shortid.generate();

store.dispatch({
    type: "ADD_LIST",
    payload: {
    boardId: firstBoardId,
    listId: firstListId,
    listTitle: "First list"
    }
});

store.dispatch({
    type: "ADD_CARD",
    payload: {
    listId: firstListId,
    cardId: shortid.generate(),
    cardText: "First card"
    }
});

store.dispatch({
    type: "ADD_CARD",
    payload: {
    listId: firstListId,
    cardId: shortid.generate(),
    cardText: "Second card"
    }
});

store.dispatch({
    type: "ADD_LIST",
    payload: {
    boardId: firstBoardId,
    listId: shortid.generate(),
    listTitle: "Second list"
    }
});

const secondBoardId = shortid.generate();

store.dispatch({
    type: "ADD_BOARD",
    payload: { boardId: secondBoardId, boardTitle: "Second board" }
});

store.dispatch({
    type: "ADD_LIST",
    payload: {
    boardId: secondBoardId,
    listId: shortid.generate(),
    listTitle: "1 list"
    }
});

store.dispatch({
    type: "ADD_LIST",
    payload: {
    boardId: secondBoardId,
    listId: shortid.generate(),
    listTitle: "2 list"
    }
});
};