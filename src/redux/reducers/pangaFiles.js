import {
  ADD_PANGA_FILES,
  REMOVE_PANGA_FILE,
  RENAME_PANGA_FILE
} from "../actionTypes";

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_PANGA_FILES: {
      return action.payload;
    }
    case REMOVE_PANGA_FILE: {
      const objIndex = state.findIndex(obj => obj.name === action.payload.name);
      var newState = [...state];
      newState.splice(objIndex, 1);
      return newState;
    }
    case RENAME_PANGA_FILE: {
      const objIndex = state.findIndex(
        obj => obj.name === action.payload.old.name
      );

      return [
        ...state.slice(0, objIndex),
        action.payload.new,
        ...state.slice(objIndex + 1)
      ];
    }
    default:
      return state;
  }
}
