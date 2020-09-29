class PangaFile {
  data = "";
  path = "";
  name = "";
  ext = "";
  dir = "";

  constructor(file) {
    this.path = file.path;
    this.name = file.name;

    var pathArray = "";

    if (navigator.appVersion.indexOf("Linux") != -1) {
      pathArray = this.path.split("/");
      for (var i = 1; i < pathArray.length - 1; i++) {
        this.dir = this.dir + "/" + pathArray[i];
      }
      this.dir += "/";
    }
    if (navigator.appVersion.indexOf("Win") != -1) {
      pathArray = this.path.split("\\");
      for (var i = 1; i < pathArray.length - 1; i++) {
        this.dir = this.dir + "\\" + pathArray[i];
      }
      this.dir += "\\";
    }

    var extArray = file.name.split(".");
    this.ext = extArray[extArray.length - 1];
  }
}

export default PangaFile;
