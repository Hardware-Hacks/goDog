window.VideoListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var videos = this.model.models;
        var len = videos.length;

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = 0; i < len; i++) {
            $('.thumbnails', this.el).append(new VideoListItemView({model: videos[i]}).render().el);
        }

        return this;
    },

});

var commandsMap = { // GoPro command numbers
    true: '01', // record
    false: '00' // stop recording
}

window.VideoListItemView = Backbone.View.extend({


    template2: _.template('<button class="<%= (isOn === "false" || !isOn) ? "btn btn-mini btn-medium" : "btn btn-mini btn-success"  %>" id="power"><%= (isOn === "false"  || !isOn) ? "Turn On" : "On"  %></button>'),
    template3: _.template('<button class="<%= (isRecording === "false" || !isRecording) ? "btn btn-medium record_buttons btn-inverse" : "btn btn-medium record_buttons btn-danger"  %>" id="recordYo"><%= (isRecording === "false"  || !isRecording) ? "Start Recording" : "<i class=\\"icon-white icon-thumbs-up\\"></i> Recording..."  %></button>'),

    keyCodeMap : {
        "a":65, "b":66, "c":67, "d":68, "e":69, "f":70, "g":71, "h":72, "i":73, "j":74, "k":75, "l":76,
        "m":77, "n":78, "o":79, "p":80, "q":81, "r":82, "s":83, "t":84, "u":85, "v":86, "w":87, "x":88, "y":89, "z":90
    },

    tagName: "li",

    initialize: function () {
        _.bindAll(this, 'keydown');
        // this.model.bind("change", this.render, this);
        this.model.bind('change:isOn', this.render, this);
        this.model.bind('change:isRecording', this.render_record_button, this);
        this.model.bind("destroy", this.close, this);
        $(document).on('keydown', this.keydown);

    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    render_record_button: function() {

        this.$el.find("#button_stuff").html(this.template3(this.model.toJSON()));
        return this;
    },


    events: {
        "click button#recordYo" : "record",
        "click button#power" : "power"
    },

    power: function() {
        var http = new XMLHttpRequest();
        var isOn = !this.model.get('isOn');

        this.model.set('isOn', isOn);
        if (!isOn) this.model.set('isRecording', false); // Stop recording if we're powering off
        this.model.save();

        var uri = 'http://' + this.model.get('piip') + ':8080/' + this.model.get('cameraip') + '/' + this.model.get('password') + '/PW/' + commandsMap[isOn];
        http.open('GET', uri, true);
        http.send();
    },

    record: function() {
        var http = new XMLHttpRequest();
        var isOn = this.model.get('isOn');
        var isRecording = !this.model.get('isRecording'); // toggle local var for recording

        this.model.set('isRecording', isRecording); // toggle model var for recording using the local var's value
        this.model.save();

        if (isOn) {
            var uri = 'http://' + this.model.get('piip') + ':8080/' + this.model.get('cameraip') + '/' + this.model.get('password') + '/SH/' + commandsMap[isRecording]; // construct a GoPro API command based on whether we're now recording

            http.open('GET', uri, true);
            http.send();
        }
    },

    keydown: function(e) {
        if ($('#power').length > 0) {
            if (e.keyCode === this.keyCodeMap[this.model.get('alphabetLetter')]) {
                this.record();
            }
        }
    }
});
