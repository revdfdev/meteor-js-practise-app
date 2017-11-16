Meteor.startup(function() {
  if (Items.find().count() == 0) {
    Items.insert({
      name: "My Item",
      uploads: []
    });
  }

  UploadServer.init({
    tmpDir: process.env.PWD + "/uploads/tmp",
    uploadDir: process.env.PWD + "/uploads",
    checkCreateDirectories: true,
    imageVersions: { thumbnailBig: { width: 240, height: 320 } },
    getDirectory: function(fileInfo, formData) {
      if (formData && formData.directoryName != null) {
        return formData.directoryName;
      }

      return "";
    },

    getFileName: function(fileInfo, formData) {
      if (formData && formData.prefix != null) {
        return formData.prefix + "_" + fileInfo.name;
      }
      return fileInfo.name;
    },

    finished: function(fileInfo, formData) {
      var Client = require("ftp");
      if (formData && formData._id != null) {
        Items.update(
          {
            _id: formData._id
          },
          {
            $push: { uploads: fileInfo }
          }
        );
      }

      var conn = new Client(
        "148.66.136.211",
        "21",
        "meteor@webautodev.com",
        "meteor123!@#"
      );
      conn.on("ready", function() {
        console.log("connections ready");
        conn.put(
          "/uploads/thumbnailBig/" + fileInfo.name,
          '/public_html/default/images' + getFileName(),
          function(err) {
            if (err) throw err;
            console.log("Upload successful");
            conn.end();
          }
        );
      });
      conn.connect();
    }
  });
});
