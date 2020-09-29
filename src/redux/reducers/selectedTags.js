import { ADD_TAG, REMOVE_TAG, CLEAR_TAGS } from "../actionTypes";

const initialState = { newFileName: "", tags: [] };

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TAG: {
      var newName = "";
      var selectedTags = [...state.tags, action.payload];
      var sortedTags = selectedTags.sort((a, b) => (a.rank > b.rank ? 1 : -1));
      for (var i = 0; i < sortedTags.length; i++) {
        newName = newName + sortedTags[i].tagName + "_";
      }
      newName += Math.random()
        .toString(36)
        .slice(2, 7);
      return { newFileName: newName, tags: sortedTags };
    }
    case REMOVE_TAG: {
      var newName = "";
      var array = [...state.tags];
      var newTagList = array.filter(
        tag => tag.tagName !== action.payload.tagName
      );

      if (newTagList.length == 0) {
        return { newFileName: "", tags: [] };
      }

      for (var i = 0; i < newTagList.length; i++) {
        newName = newName + newTagList[i].tagName + "_";
      }

      newName += Math.random()
        .toString(36)
        .slice(2, 7);

      return {
        newFileName: newName,
        tags: newTagList
      };
    }
    case CLEAR_TAGS: {
      return initialState;
    }
    default:
      return state;
  }
}
