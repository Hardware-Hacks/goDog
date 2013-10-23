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
        $("#button_stuff").html(this.template3(this.model.toJSON()));        

        return this;
    }, 


    events: {
        "click button#recordYo" : "recordYo",
        "click button#power" : "turnOnYo"
    },

    turnOnYo: function () {
        var isOnNow = this.model.get('isOn');     

        if (isOnNow === 'false' || !isOnNow ) {            
            this.callPowerPi("powerOn");
            this.model.set('isOn', 'true');
        } else {
            this.callPowerPi("powerOff");
            this.model.set('isOn', 'false');
            this.model.set('isRecording', 'false');
        }
        this.model.save();
    },    

    recordYo: function () {
        var isRecordingNow = this.model.get('isRecording');     

        if (isRecordingNow === 'false' || !isRecordingNow ) {            
            this.callRecordPi("record");
            this.model.set('isRecording', 'true');

        } else {
            this.callRecordPi("stopRecord");
            this.model.set('isRecording', 'false');       
        }
        this.model.save();
    },

    keydown: function(e) {
        if (e.keyCode === this.keyCodeMap[this.model.get('alphabetLetter')]) {
            console.log('keydown');
           this.recordYo(); 
        }
    }, 

    callRecordPi: function(a) {
        var http = new XMLHttpRequest();
        var isOn = this.model.get('isOn');

        if (isOn === "true") {
            if (a === "record") {
                var uri = 'http://' + this.model.get('piip') + ':8080/' + this.model.get('cameraip') + '/' + this.model.get('password') + '/SH/01';
                console.log(uri);
                console.log(isOn);
                http.open('GET', uri, true);
            } else if (a == "stopRecord") {
                var uri = 'http://' + this.model.get('piip') + ':8080/' + this.model.get('cameraip') + '/' + this.model.get('password') + '/SH/00'
                console.log(uri);
                http.open('GET', uri, true);
            }
        } else {
            var uri = '#';
        }

        console.log(a);

        http.onreadystatechange = function(evt) { console.log(http.status); }
        http.send();

    },

    callPowerPi: function(a) {
        var http = new XMLHttpRequest();
        if (a === "powerOn") {
            var uri = 'http://' + this.model.get('piip') + ':8080/' + this.model.get('cameraip') + '/' + this.model.get('password') + '/PW/01';
            console.log(uri);
            http.open('GET', uri, true);
        } else if (a == "powerOff") {
            var uri = 'http://' + this.model.get('piip') + ':8080/' + this.model.get('cameraip') + '/' + this.model.get('password') + '/PW/00'
            console.log(uri);
            http.open('GET', uri, true);
        }

        console.log(a);

        http.onreadystatechange = function(evt) { console.log(http.status); }
        http.send();

    }    


});
