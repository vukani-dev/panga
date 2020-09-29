import {
  ADD_PANGA_FILES,
  FILE_SELECTED,
  ADD_TAG,
  REMOVE_TAG,
  RENAME_PANGA_FILE,
  REMOVE_PANGA_FILE,
  CLEAR_TAGS
} from "./actionTypes";

export const addPangaFiles = content => ({
  type: ADD_PANGA_FILES,
  payload: content
});

export const renameFile = content => ({
  type: RENAME_PANGA_FILE,
  payload: content
});

export const removeFile = content => ({
  type: REMOVE_PANGA_FILE,
  payload: content
});

export const fileSelected = content => ({
  type: FILE_SELECTED,
  payload: content
});

export const addTag = content => ({
  type: ADD_TAG,
  payload: content
});

export const removeTag = content => ({
  type: REMOVE_TAG,
  payload: content
});

export const clearTags = () => ({
  type: CLEAR_TAGS
});
