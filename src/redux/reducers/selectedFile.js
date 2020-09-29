import {
    FILE_SELECTED
} from '../actionTypes'

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case FILE_SELECTED: {
            return action.payload
        }
        default:
            return state;
    }
}