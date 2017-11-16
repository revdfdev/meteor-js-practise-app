Template.home.helpers({ 
    myFormData: function() {
        return {
            directoryName: 'images',
            prefix: this.id, 
            _id: this._id
        }
    },

    filesToUpload: function() {
        return Uploader.info.get();
    }
});
