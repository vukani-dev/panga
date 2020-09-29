import React from "react";
import { connect } from "react-redux";
import * as b from "../Blueprint";
import { addTag, removeTag } from "../../redux/actions";
import "./TagManager.css";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';


const mapStateToProps = state => {
  return { state };
};

class TagManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags,
      creatingTag: false,
      newTagName: "",
      newTagRank: 0,
      creatingTagTitle: "",
      settingsOpen: false
    };
  }

  testClick = () => {
    console.log(this.props);
  };

  escapeRegExpChars(text) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  highlightText(text, query) {
    let lastIndex = 0;
    const words = query
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(this.escapeRegExpChars);
    if (words.length === 0) {
      return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens = [];
    while (true) {
      const match = regexp.exec(text);
      if (!match) {
        break;
      }
      const length = match[0].length;
      const before = text.slice(lastIndex, regexp.lastIndex - length);
      if (before.length > 0) {
        tokens.push(before);
      }
      lastIndex = regexp.lastIndex;
      tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
      tokens.push(rest);
    }
    console.log(tokens);
    return tokens;
  }

  renderTag = (tag, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <b.MenuItem
        label={tag.rank}
        key={tag.indx}
        onClick={handleClick}
        active={modifiers.active}
        text={this.highlightText(tag.tagName, query)}
      />
    );
  };

  tagSelected = tag => {
    var tagExists = this.props.tags.some(t => t.tagName === tag.tagName);
    var tagAlreadyAdded = this.props.state.selectedTags.tags.some(
      t => t.tagName === tag.tagName
    );

    if (tagExists) {
      if (tagAlreadyAdded) {
        return;
      }

      this.props.addTag(tag);
    } else {
      this.setState({
        creatingTag: true,
        newTagName: tag,
        creatingTagTitle: `Creating ${tag} tag`
      });
    }
  };

  handleClose = event => {
    this.setState({ creatingTag: false, settingsOpen: false });
  };

  renderItem = e => {
    return e.tagName;
  };

  createNewTag = tagName => {
    return tagName;
  };

  addTag = () => {
    var newTag = {
      tagName: this.state.newTagName,
      rank: this.state.newTagRank,
      indx: this.props.tags.length + 1
    };

    this.props.createTag(newTag);
    this.props.addTag(newTag);
    this.setState({ creatingTag: false });
  };

  renderCreateNewTag = (query, active, handleClick) => {
    return (
      <b.MenuItem
        icon="add"
        onClick={handleClick}
        active={active}
        text={`Create "${query}" tag`}
        shouldDismissPopover={false}
      />
    );
  };

  filterList = (query, tag) => {
    const normalizedTagName = tag.tagName.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return `${normalizedTagName}${tag.priority}`.indexOf(normalizedQuery) >= 0;
  };

  openSettings = () => {
    console.log(this.props.tags);
    this.setState({ settingsOpen: true });
  };

  createTagDialog = () => {
    return (
      <b.Dialog
        icon="add"
        onClose={this.handleClose}
        isCloseButtonShown={false}
        title={this.state.creatingTagTitle}
        isOpen={this.state.creatingTag}
      >
        <div className={b.Classes.DIALOG_BODY}>
          <b.NumericInput
            onValueChange={event => this.setState({ newTagRank: event })}
            placeholder="Enter tag ranking"
            buttonPosition="none"
          ></b.NumericInput>
        </div>
        <div className={b.Classes.DIALOG_FOOTER}>
          <div className={b.Classes.DIALOG_FOOTER_ACTIONS}>
            <b.Button
              intent={b.Intent.PRIMARY}
              onClick={this.addTag}
            >
              Create Tag
            </b.Button>
          </div>
        </div>
      </b.Dialog>
    );
  };

  render() {
    const tagElements = this.props.state.selectedTags.tags.map(tag => {
      const onRemove = () => {
        this.props.removeTag(tag);
      };
      return (
        <b.Tag style={{ margin: "3px" }} key={tag.indx} onRemove={onRemove}>
          {tag.tagName}
        </b.Tag>
      );
    });

    return (
      <div className="wrapper2">
        {this.createTagDialog()}
        <div className="newName">
          <h3>{this.props.state.selectedTags.newFileName}</h3>
        </div>
        <div className="currentTags">{tagElements}</div>
        {/* <div className="commonTags">
          <b.Button
            text={"test"}
            onClick={() => this.testClick()}
            intent={b.Intent.PRIMARY}
          ></b.Button>
        </div> */}
        <div className="searchTags" id="searchBar">
          <b.Suggest
            items={this.props.tags}
            inputValueRenderer={this.renderItem}
            onItemSelect={this.tagSelected}
            itemRenderer={this.renderTag}
            createNewItemFromQuery={this.createNewTag}
            createNewItemRenderer={this.renderCreateNewTag}
            noResults={<b.MenuItem disabled={true} text="No results." />}
            itemPredicate={this.filterList}
            fill="true"
            ref={this.props.searchRef}
          ></b.Suggest>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, { addTag, removeTag })(TagManager);
