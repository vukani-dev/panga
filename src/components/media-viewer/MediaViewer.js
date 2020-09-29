import React from "react";
import { connect } from "react-redux";
import * as b from "../Blueprint";
import { fileSelected } from "../../redux/actions";
import "./MediaViewer.css";

const mapStateToProps = state => {
  return { state };
};

class MediaViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editBookmark: false, selectedBookmark: 0 };
  }

  handleEditClose = event => {
    this.setState({ editBookmark: false });
  };
  testClick() {
    console.log(this.props);
    console.log(Object.entries(this.props.bookmarks.one).length === 0);
  }

  openBookmark = bookmark => {
    this.setState({ selectedBookmark: bookmark, editBookmark: true });
  };

  editBookmarkRender = () => {
    const tagsElement = this.props.tags.map(tag => {
      const onClick = event => {
        this.props.editBookmark(this.state.selectedBookmark, tag);
        this.setState({ editBookmark: false });
      };
      return (
        <b.Tag
          style={{ margin: "7px" }}
          large={true}
          interactive={true}
          key={tag.indx}
          onClick={onClick}
        >
          {tag.tagName}
          <b.Button minimal="true">{tag.rank}</b.Button>
        </b.Tag>
      );
    });
    return (
      <b.Dialog
        icon="edit"
        onClose={this.handleEditClose}
        isOpen={this.state.editBookmark}
        title="Select tag for bookmark"
      >
        <div className={b.Classes.DIALOG_BODY}>{tagsElement}</div>
      </b.Dialog>
    );
  };

  render() {
    return (
      <div className="wrapper">
        {this.editBookmarkRender()}
        <div className="fileList">
          {this.props.state.pangaFiles.map((file, i) => {
            return (
              <div key={i} onClick={() => this.props.fileSelected(file)}>
                <img style={{ height: "50px" }} src={file.data}></img>
              </div>
            );
          })}
        </div>
        <div className="selectedFile">
          <img
            style={{ height: "420px", paddingRight: "5px", width: "520px" }}
            src={this.props.state.selectedFile.data}
          ></img>
        </div>

        <div>
          <b.Card elevation={b.Elevation.TWO} style={{ marginBottom: "20px" }}>
            <b.Button
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              icon="confirm"
              intent="success"
              text="Accept"
              onClick={this.props.acceptFile}
            />
            <b.Button
              style={{ width: "100%" }}
              icon="small-cross"
              intent="danger"
              text="Delete"
              onClick={this.props.deleteFile}
            />
          </b.Card>

          <b.Card elevation={b.Elevation.TWO} style={{ marginBottom: "20px" }}>
            <b.Button
              style={{ width: "100%" }}
              icon="share"
              intent="primary"
              text="Open"
              onClick={this.props.openFile}
            />
          </b.Card>

          <b.Card elevation={b.Elevation.TWO} style={{ padding: "2px" }}>
            <div className="bookmark-wrapper">
              <b.Tooltip
                usePortal="true"
                content={this.props.bookmarks.one.tagName}
                className="one"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.one).length === 0
                  }
                  text="1"
                  onClick={e => this.openBookmark(1)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.two.tagName}
                className="two"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.two).length === 0
                  }
                  text="2"
                  onClick={e => this.openBookmark(2)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.three.tagName}
                className="three"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.three).length === 0
                  }
                  text="3"
                  onClick={e => this.openBookmark(3)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.four.tagName}
                className="four"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.four).length === 0
                  }
                  text="4"
                  onClick={e => this.openBookmark(4)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.five.tagName}
                className="five"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.five).length === 0
                  }
                  text="5"
                  onClick={e => this.openBookmark(5)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.six.tagName}
                className="six"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.six).length === 0
                  }
                  text="6"
                  onClick={e => this.openBookmark(6)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.seven.tagName}
                className="seven"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.seven).length === 0
                  }
                  text="7"
                  onClick={e => this.openBookmark(7)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.eight.tagName}
                className="eight"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.eight).length === 0
                  }
                  text="8"
                  onClick={e => this.openBookmark(8)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.nine.tagName}
                className="nine"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.nine).length === 0
                  }
                  text="9"
                  onClick={e => this.openBookmark(9)}
                />
              </b.Tooltip>
              <b.Tooltip
                content={this.props.bookmarks.zero.tagName}
                className="zero"
              >
                <b.Button
                  intent="warning"
                  minimal={
                    Object.entries(this.props.bookmarks.zero).length === 0
                  }
                  text="0"
                  onClick={e => this.openBookmark(0)}
                />
              </b.Tooltip>
            </div>
          </b.Card>
        </div>

        {/* <b.Button onClick={() => this.testClick()}>Test</b.Button> */}
      </div>
    );
  }
}

export default connect(mapStateToProps, { fileSelected })(MediaViewer);
