import React from "react";
import update from "immutability-helper";
import MediaViewer from "../components/media-viewer/MediaViewer";
import {
  addPangaFiles,
  removeTag,
  addTag,
  fileSelected,
  renameFile,
  removeFile,
  clearTags
} from "../redux/actions";
import { connect } from "react-redux";
import PangaFile from "../common/PangaFile";
import { emptyBookmarks } from "../common/PangaBookmarks";
import "./Panga.css";
import * as b from "../components/Blueprint";
import TagManager from "../components/tag-manager/TagManager";

import { HotKeys, GlobalHotKeys } from "react-hotkeys";

const { ipcRenderer, webContents } = window.require("electron");
const mapStateToProps = state => {
  return { state };
};

const exportToJson = objectData => {
  let filename = "pangaTags.json";
  let contentType = "application/json;charset=utf-8;";
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    var blob = new Blob(
      [decodeURIComponent(encodeURI(JSON.stringify(objectData)))],
      { type: contentType }
    );
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    var a = document.createElement("a");
    a.download = filename;
    a.href =
      "data:" +
      contentType +
      "," +
      encodeURIComponent(JSON.stringify(objectData));
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

class Panga extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dirName: "Please select a directory",
      fileName: "No file selected",
      loading: false,
      tags: [],
      filesLoaded: 0,
      tagsLoaded: false,
      settingsOpen: false,
      selectedTag: {},
      editingTag: false,
      deletingFile: false,
      askDelete: true,
      bookmarks: {}
    };

    this.search = React.createRef();

    this.nextFile = () => {
      var inx = -1;
      if (Object.entries(this.props.state.selectedFile).length !== 0) {
        inx = this.props.state.pangaFiles.indexOf(
          this.props.state.selectedFile
        );
      }

      if (inx == this.props.state.pangaFiles.length - 1) {
        this.props.fileSelected(
          this.props.state.pangaFiles[this.props.state.pangaFiles.length - 1]
        );
      } else {
        this.props.fileSelected(this.props.state.pangaFiles[inx + 1]);
      }
    };

    this.prevFile = () => {
      var inx = 0;
      if (Object.entries(this.props.state.selectedFile).length !== 0) {
        inx = this.props.state.pangaFiles.indexOf(
          this.props.state.selectedFile
        );
      }
      if (inx > 0) {
        this.props.fileSelected(this.props.state.pangaFiles[inx - 1]);
      } else {
        this.props.fileSelected(this.props.state.pangaFiles[0]);
      }
    };

    this.focusSearch = () => {
      this.search.current.input.focus();
    };

    this.handlers = {
      HOTKEY_ONE: e => this.addBookmark(this.state.bookmarks.one),
      HOTKEY_TWO: e => this.addBookmark(this.state.bookmarks.two),
      HOTKEY_THREE: e => this.addBookmark(this.state.bookmarks.three),
      HOTKEY_FOUR: e => this.addBookmark(this.state.bookmarks.four),
      HOTKEY_FIVE: e => this.addBookmark(this.state.bookmarks.five),
      HOTKEY_SIX: e => this.addBookmark(this.state.bookmarks.six),
      HOTKEY_SEVEN: e => this.addBookmark(this.state.bookmarks.seven),
      HOTKEY_EIGHT: e => this.addBookmark(this.state.bookmarks.eight),
      HOTKEY_NINE: e => this.addBookmark(this.state.bookmarks.nine),
      HOTKEY_ZERO: e => this.addBookmark(this.state.bookmarks.zero),
      HOTKEY_UP: this.prevFile,
      HOTKEY_DOWN: this.nextFile,
      HOTKEY_ACCEPT: this.acceptFile,
      HOTKEY_DELETE: this.deleteFile,
      HOTKEY_SEARCH: this.focusSearch
    };
    this.keyMap = {
      HOTKEY_ONE: "f1",
      HOTKEY_TWO: "f2",
      HOTKEY_THREE: "f3",
      HOTKEY_FOUR: "f4",
      HOTKEY_FIVE: "f5",
      HOTKEY_SIX: "f6",
      HOTKEY_SEVEN: "f7",
      HOTKEY_EIGHT: "f8",
      HOTKEY_NINE: "f9",
      HOTKEY_ZERO: "f10",
      HOTKEY_ACCEPT: "`",
      HOTKEY_DELETE: "del",
      HOTKEY_UP: "up",
      HOTKEY_DOWN: "down",
      HOTKEY_SEARCH: "ctrl"
    };
  }

  addBookmark = tag => {
    var emptyBookmark = Object.entries(tag).length === 0;
    if (emptyBookmark) {
      return;
    }
    var tagAlreadyAdded = this.props.state.selectedTags.tags.some(
      t => t.tagName === tag.tagName
    );
    if (tagAlreadyAdded) {
      return;
    }
    tag.indx = this.props.state.selectedTags.tags.length;
    this.props.addTag(tag);
  };

  selectDir = () => {
    document.getElementById("dirSelector").click();
  };

  selectTags = () => {
    document.getElementById("tagSelector").click();
  };

  loadTags = tags => {
    var json = JSON.parse(tags.target.result);
    json.list = json.list.map((m, index) => ({ ...m, indx: index + 1 }));
    this.setState({
      tags: json.list,
      tagsLoaded: true,
      bookmarks: json.bookmarks
    });
  };

  tagFileSelected = file => {
    var reader = new FileReader();
    reader.onloadend = this.loadTags;
    reader.readAsText(file);
  };

  validateFiles = files => {
    //gonna do some validation later
    return true;
  };

  test = () => {
    console.log(this.state);
    // ipcRenderer.send("renameFile", "hi");
    // console.log(ipcRenderer);

    // ipcRenderer.on("asynchronous-reply", (event, arg) => {
    //   console.log(arg); // prints "pong"
    // });

    // ipcRenderer.send('asynchronous-message', 'ping')
  };

  acceptFile = () => {
    var targetFile = this.props.state.selectedFile;
    var newFilename = `${this.props.state.selectedTags.newFileName}.${targetFile.ext}`;
    var newPath = targetFile.dir + newFilename;

    var newFile = new PangaFile({ name: newFilename, path: newPath });
    newFile.data = targetFile.data;

    var renameObj = { old: this.props.state.selectedFile, new: newFile };
    console.log(renameObj);

    ipcRenderer.send("renameFile", renameObj);
    this.props.renameFile(renameObj);
    this.props.fileSelected(newFile);

    this.props.clearTags();

    b.AppToaster.show({
      intent: "success",
      message: "File renamed",
      icon: "tick",
      timeout: 3000
    });
  };

  deleteFile = () => {
    var targetFile = this.props.state.selectedFile;
    ipcRenderer.send("deleteFile", targetFile.path);
    this.props.removeFile(targetFile);
    const objIndex = this.props.state.pangaFiles.findIndex(
      obj => obj.name === targetFile.name
    );
    this.props.fileSelected(this.props.state.pangaFiles[objIndex + 1]);
    b.AppToaster.show({
      intent: "success",
      message: "File deleted",
      icon: "tick",
      timeout: 3000
    });
  };

  openFile = () => {
    var targetFile = this.props.state.selectedFile;
    ipcRenderer.send("openFile", targetFile.path);
  };

  setFileData = event => {
    const content = event.target.result;
    var fileNum = event.target.flag;
    var currentCompletion = fileNum / event.target.totalFlags;

    this.setState({
      files: update(this.state.files, {
        [fileNum]: { data: { $set: content } }
      })
    });

    if (currentCompletion >= this.state.filesLoaded) {
      this.setState({ filesLoaded: currentCompletion });
    }

    if (currentCompletion == 1) {
      var sessionTags = localStorage.getItem("panga_tags");
      var sessionBookmarks = localStorage.getItem("panga_bookmarks");
      this.setState({
        loading: false,
        tags: sessionTags == null ? [] : JSON.parse(sessionTags),
        bookmarks:
          sessionBookmarks == null
            ? emptyBookmarks
            : JSON.parse(sessionBookmarks)
      });
      this.props.addPangaFiles(this.state.files);
      this.props.fileSelected(this.state.files[0]);
    }
  };

  directoryChanged = files => {
    if (files.length == 0) {
      return;
    }
    var results = [];
    // var dirName = "";
    this.setState({ loading: true, filesLoaded: 0 });
    if (files.length != 0) {
      // dirName = files[0].path.substr(0, files[0].path.lastIndexOf("/"));
      for (var i = 0; i < files.length; i++) {
        if (files[i] instanceof Blob && this.validateFiles(files)) {
          var file = new PangaFile(files[i]);
          var reader = new FileReader();
          reader.flag = i;
          reader.totalFlags = files.length - 1;
          reader.onloadend = this.setFileData;
          reader.readAsDataURL(files[i]);

          results.push(file);
        }
      }
    }
    this.setState({ files: results });
  };

  createTag = newTag => {
    var tags = [...this.state.tags, newTag];
    this.setState({ tags: tags });
    b.AppToaster.show({
      intent: "success",
      message: "Tag added",
      icon: "tick",
      timeout: 3000
    });
    // console.log(this.state);
  };

  exportTags = () => {
    exportToJson({ list: this.state.tags, bookmarks: this.state.bookmarks });
  };

  handleClose = event => {
    this.setState({ creatingTag: false, settingsOpen: false });
  };
  handleEditClose = event => {
    this.setState({ editingTag: false, deleteFile: false });
  };

  removeTag = tag => {
    var newTagList = this.state.tags
      .filter(tag => tag.tagName !== this.state.selectedTag.tagName)
      .map((m, index) => ({ ...m, indx: index + 1 }));
    this.setState({ tags: newTagList });

    this.handleEditClose();

    b.AppToaster.show({
      intent: "success",
      message: "Tag removed",
      icon: "tick",
      timeout: 3000
    });
  };

  saveTags = () => {
    localStorage.setItem("panga_tags", JSON.stringify(this.state.tags));
    localStorage.setItem(
      "panga_bookmarks",
      JSON.stringify(this.state.bookmarks)
    );
  };

  clearTags = () => {
    localStorage.clear();
    this.setState({ tags: [], bookmarks: emptyBookmarks });
  };

  editTag = () => {
    var editedTag = this.state.selectedTag;
    let newTagsArray = this.state.tags.map(a => {
      return { ...a };
    });

    newTagsArray[editedTag.indx - 1] = editedTag;
    console.log(newTagsArray);
    this.setState({ tags: newTagsArray });
    this.handleEditClose();

    b.AppToaster.show({
      intent: "success",
      message: "Tag updated",
      icon: "tick",
      timeout: 3000
    });
  };
  editTagOverlay = () => {
    return (
      <b.Dialog
        icon="edit"
        onClose={this.handleEditClose}
        isOpen={this.state.editingTag}
        title="Edit Tag"
      >
        <div className={b.Classes.DIALOG_BODY}>
          <b.InputGroup
            value={this.state.selectedTag.tagName}
            onChange={event =>
              this.setState({
                selectedTag: {
                  ...this.state.selectedTag,
                  tagName: event.target.value
                }
              })
            }
          ></b.InputGroup>
          <b.NumericInput
            value={this.state.selectedTag.rank}
            onValueChange={event =>
              this.setState({
                selectedTag: { ...this.state.selectedTag, rank: event }
              })
            }
            placeholder="Enter tag ranking"
          ></b.NumericInput>
        </div>
        <div className={b.Classes.DIALOG_FOOTER}>
          <div className={b.Classes.DIALOG_FOOTER_ACTIONS}>
            <b.Button
              text="Delete"
              intent="danger"
              onClick={this.removeTag}
            ></b.Button>
            <b.Button
              text="Confirm Edit"
              intent="success"
              onClick={this.editTag}
            ></b.Button>
          </div>
        </div>
      </b.Dialog>
    );
  };

  tagSettingsDrawer = () => {
    const tagsElement = this.state.tags.map(tag => {
      const onClick = event => {
        this.setState({ selectedTag: tag, editingTag: true });
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
      <b.Drawer
        icon="cog"
        title="Tag Settings"
        isOpen={this.state.settingsOpen}
        onClose={this.handleClose}
        position={b.Position.RIGHT_BOTTOM}
        usePortal={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
      >
        {this.editTagOverlay()}
        <div className={b.Classes.DRAWER_HEADER}>
          <b.Button
            intent="primary"
            icon="import"
            text="Load"
            className="tagTools"
            onClick={() => this.selectTags()}
          ></b.Button>
          <b.Button
            intent="primary"
            icon="export"
            text="Export"
            className="tagTools"
            onClick={() => this.exportTags()}
          ></b.Button>
          <b.Button
            intent="primary"
            icon="floppy-disk"
            text="Save"
            className="tagTools"
            onClick={() => this.saveTags()}
          ></b.Button>
          <b.Button
            intent="danger"
            icon="eraser"
            text="Clear"
            className="tagTools"
            onClick={() => this.clearTags()}
          ></b.Button>
        </div>

        <div className={b.Classes.DRAWER_BODY}>{tagsElement}</div>
      </b.Drawer>
    );
  };

  deleteFileRender = () => {
    return (
      <b.Alert
        onClose={() => {
          this.setState({ deletingFile: false });
        }}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        icon="trash"
        isOpen={this.state.deletingFile}
        intent="danger"
        onCancel={() => {
          this.setState({ deletingFile: false });
        }}
        onConfirm={this.deleteFile}
      >
        <p>Are you sure you want to delete this file ?</p>
        <b.Checkbox
          checked={!this.state.askDelete}
          onChange={event => {
            console.log(event);
            this.setState({ askDelete: !this.state.askDelete });
          }}
        >
          {" "}
          Dont ask again!
        </b.Checkbox>
      </b.Alert>
    );
  };
  editBookmark = (bookmark, tag) => {
    const bookmarks = { ...this.state.bookmarks };
    switch (bookmark) {
      case 0:
        bookmarks.zero = tag;
        break;
      case 1:
        bookmarks.one = tag;
        break;
      case 2:
        bookmarks.two = tag;
        break;
      case 3:
        bookmarks.three = tag;
        break;
      case 4:
        bookmarks.four = tag;
        break;
      case 5:
        bookmarks.five = tag;
        break;
      case 6:
        bookmarks.six = tag;
        break;
      case 7:
        bookmarks.seven = tag;
        break;
      case 8:
        bookmarks.eight = tag;
        break;
      case 9:
        bookmarks.nine = tag;
        break;
    }
    this.setState({ bookmarks: bookmarks });
  };
  render() {
    const loading = this.state.loading;
    const filesLoaded = this.state.filesLoaded;
    let mediaViewerRender;
    let tagManagerRender;
    let tagExportRender;
    let tagSettingsRender;
    let fileName;

    if (loading) {
      mediaViewerRender = (
        <div style={{ marginTop: "200px", padding: "30px" }}>
          <h2>Loading Files...</h2>
          <b.ProgressBar
            intent={b.Intent.PRIMARY}
            value={this.state.filesLoaded}
          ></b.ProgressBar>
        </div>
      );
    } else {
      if (filesLoaded == 1) {
        mediaViewerRender = (
          <MediaViewer
            bookmarks={this.state.bookmarks}
            editBookmark={this.editBookmark}
            tags={this.state.tags}
            acceptFile={this.acceptFile}
            deleteFile={() => {
              if (this.state.askDelete) {
                this.setState({ deletingFile: true });
              } else {
                this.deleteFile();
              }
            }}
            openFile={this.openFile}
          ></MediaViewer>
        );
        tagManagerRender = (
          <TagManager
            tags={this.state.tags}
            createTag={this.createTag}
            searchRef={this.search}
          ></TagManager>
        );
        tagSettingsRender = (
          <b.Button
            intent={b.Intent.PRIMARY}
            minimal="true"
            icon="cog"
            text="Tag Settings"
            onClick={() => this.setState({ settingsOpen: true })}
          />
        );
      } else {
        //can replace these with instruction renders
        mediaViewerRender = <div></div>;
        tagManagerRender = <div></div>;
        tagExportRender = <div></div>;
      }
    }

    if (this.state.tags.length != 0) {
      tagExportRender = (
        <b.Button
          intent={b.Intent.PRIMARY}
          icon="export"
          text="Export Tags"
          small={true}
          onClick={this.exportTags}
        />
      );
    }

    if (Object.entries(this.props.state.selectedFile).length !== 0) {
      fileName = <h5>{this.props.state.selectedFile.name}</h5>;
    } else {
      fileName = <div></div>;
    }

    return (
      <div>
        <GlobalHotKeys keyMap={this.keyMap} handlers={this.handlers} />
        {this.deleteFileRender()}
        {/* {this.showToast()} */}
        <div>
          <input
            hidden
            id="dirSelector"
            webkitdirectory="true"
            type="file"
            onChange={e => this.directoryChanged(e.target.files)}
          />
          <input
            hidden
            id="tagSelector"
            type="file"
            onChange={e => this.tagFileSelected(e.target.files[0])}
          />
        </div>
        {this.tagSettingsDrawer()}
        <div className="container">
          <div className="navBar">
            <b.Navbar>
              <b.NavbarGroup align={b.Alignment.LEFT}>
                <b.NavbarHeading>Panga</b.NavbarHeading>
                <b.NavbarDivider />
                {/* <b.Button onClick={() => this.test()}></b.Button> */}
                {/* <h4>{this.state.dirName}</h4> */}
                {/* <b.NavbarDivider /> */}
                {fileName}
                {/* <h5>{this.props.state.selectedFile.file.name}</h5> */}
              </b.NavbarGroup>
              <b.NavbarGroup align={b.Alignment.RIGHT}>
                <b.Button
                  intent={b.Intent.PRIMARY}
                  minimal="true"
                  icon="selection"
                  text="Open Directory"
                  onClick={this.selectDir}
                />
                {tagSettingsRender}
                {/* {tagExportRender} */}
              </b.NavbarGroup>
            </b.Navbar>
          </div>
          <div className="mediaViewer">{mediaViewerRender}</div>
          <div className="tagManager">{tagManagerRender}</div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  addPangaFiles,
  removeTag,
  addTag,
  fileSelected,
  renameFile,
  removeFile,
  clearTags
})(Panga);
