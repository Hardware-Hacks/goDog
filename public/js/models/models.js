window.Video = Backbone.Model.extend({

    urlRoot: "/videos",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        // this.validators.ip = function (value) {
        //     return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a camera"};
        // };

    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        password: "",
        ip: "",
        description: "",
        picture: null,
        isRecording: false,
        alphabetLetter: "",
        isOn: false
    }
});

window.VideoCollection = Backbone.Collection.extend({

    model: Video,

    url: "/videos"

});