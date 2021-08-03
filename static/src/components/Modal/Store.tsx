import React, { createContext, useReducer } from "react";

interface reducerState {
    selected: string;
    modalActions: {
        onClose: () => void;
    }
}

interface reducerAction {
    type?: "SET" | "REMOVE";
    id?: string;
    onClose?: () => void;
}

export const ModalReducer = (state: reducerState, { type, id, onClose }: reducerAction): reducerState => {
    switch (type) {
        case 'SET':
            return { selected: id || "", modalActions: {  onClose: onClose || (() => {}) } };
        case 'REMOVE':
            return { selected: "", modalActions: { onClose: () => {} } }
        default:
            return { selected: id || "", modalActions: {  onClose: onClose || (() => {}) } };
    }
}

const initialState: reducerState = {
    selected: "",
    modalActions: {
        onClose: () => {}
    }
};

let initalContext: [reducerState, React.Dispatch<reducerAction>] = [initialState, () => {}]
export const ModalContext = createContext(initalContext);

const Store = ({ children }: any) => {
    const [state, dispatch] = useReducer(ModalReducer, initialState);
    return (
        <ModalContext.Provider value={[state, dispatch]}>
            {children}
        </ModalContext.Provider>
    )
};

export default Store;