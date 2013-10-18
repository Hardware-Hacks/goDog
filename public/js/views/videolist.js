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

     
    keyCodeMap : {
        "a":65, "b":66, "c":67, "d":68, "e":69, "f":70, "g":71, "h":72, "i":73, "j":74, "k":75, "l":76,
        "m":77, "n":78, "o":79, "p":80, "q":81, "r":82, "s":83, "t":84, "u":85, "v":86, "w":87, "x":88, "y":89, "z":90
    },

    tagName: "li",

    initialize: function () {
        _.bindAll(this, 'keydown');
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);  
        $(document).on('keydown', this.keydown);

    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    },

    events: {
        "click button#recordYo" : "recordYo"
        // 'click button#openEssay':'openEssay'
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
        if (a === "record") {
            http.open('GET', 'http://localhost:8080/' + this.model.get('ip') + '/' + this.model.get('password') + '/PW/01', true);
        } else if (a == "stopRecord") {
            http.open('GET', 'http://localhost:8080/' + this.model.get('ip') + '/' + this.model.get('password') + '/PW/00', true);
        }

        console.log(a);

        // http.onreadystatechange = function(evt) { console.log(evt); }
        http.send();

    }


});
