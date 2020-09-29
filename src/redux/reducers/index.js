import { combineReducers } from "redux";
import pangaFiles from "./pangaFiles";
import selectedFile from "./selectedFile";
import selectedTags from "./selectedTags";

export default combineReducers({pangaFiles, selectedTags, selectedFile});