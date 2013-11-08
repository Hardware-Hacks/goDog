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
    true: '01', // turn something on
    false: '00' // turn something off
}

// Get the status of the GoPro
var getStatus = function(dis) {
    $.ajax({
        cache: false,
        dataType: 'jsonp',
        url: 'http://' + dis.model.get('piip') + ':8080/status?password=' + dis.model.get('password'),
        success: function(json) {
            var status = JSON.parse(json);
            dis.model.set('isOn', status['power']);
            dis.model.set('isRecording', status['recording']);
            dis.model.set('memoryLeft', status['memoryLeft']);
            dis.model.set('batteryLeft', status['batteryLeft']);
            dis.model.save();
        }
    })
}

window.VideoListItemView = Backbone.View.extend({


    template2: _.template('<button class="<%= (isOn === "false" || !isOn) ? "btn btn-mini btn-medium" : "btn btn-mini btn-success"  %>" id="power"><%= (isOn === "false"  || !isOn) ? "Turn On" : "On"  %></button>'),
    template3: _.template('<button class="<%= (isRecording === "false" || !isRecording) ? "btn btn-medium record_buttons btn-inverse" : "btn btn-medium record_buttons btn-danger"  %>" id="recordYo"><%= (isRecording === "false"  || !isRecording) ? "Start Recording" : "<i class=\\"icon-white icon-thumbs-up\\"></i> Recording..."  %></button>'),
    memoryLeftTemplate: _.template('<span class="memoryLeft">Memory left: <%= Math.round(memoryLeft / 10000000) / 100 %> GB</span>'),

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
        this.model.bind('change:memoryLeft', this.render_memoryLeft, this);
        this.model.bind("destroy", this.close, this);
        $(document).on('keydown', this.keydown);

        var dis = this;
        $(function() {
            // poll the status every five seconds
            setInterval(function() {
                getStatus(dis);
            }, 5000);
        });
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    render_record_button: function() {

        this.$el.find("#button_stuff").html(this.template3(this.model.toJSON()));
        return this;
    },

    render_memoryLeft: function() {
        this.$el.find(".memoryLeft").html(this.memoryLeftTemplate(this.model.toJSON()));
    },

    events: {
        "click button#recordYo" : "record",
        "click button#power" : "power"
    },

    power: function() {
        var isOn = !this.model.get('isOn');

        var dis = this;
        $.ajax({
            cache: false,
            dataType: 'jsonp',
            url: 'http://' + dis.model.get('piip') + ':8080/power/' + isOn.toString() + '?password=' + dis.model.get('password'),
            success: function(json) {
                var status = JSON.parse(json);
                dis.model.set('isOn', status['power']);
                dis.model.set('isRecording', status['recording']);
                dis.model.set('memoryLeft', status['memoryLeft']);
                dis.model.set('batteryLeft', status['batteryLeft']);
                dis.model.save();
            }
        });
    },

    record: function() {
        var http = new XMLHttpRequest();
        var isOn = this.model.get('isOn');
        var isRecording = !this.model.get('isRecording'); // toggle local var for recording

        var dis = this;

        if (isOn) {
            $.ajax({
                cache: false,
                dataType: 'jsonp',
                url: 'http://' + dis.model.get('piip') + ':8080/record/' + isRecording.toString() + '?password=' + dis.model.get('password'),
                success: function(json) {
                    var status = JSON.parse(json);
                    dis.model.set('isOn', status['power']);
                    dis.model.set('isRecording', status['recording']);
                    dis.model.set('memoryLeft', status['memoryLeft']);
                    dis.model.set('batteryLeft', status['batteryLeft']);
                    dis.model.save();
                }
            });
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
