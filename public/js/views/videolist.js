window.VideoListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var videos = this.model.models;
        var len = videos.length;
        console.log(this.model);
        // console.log(this.model.models);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = 0; i < len; i++) {
            $('.thumbnails', this.el).append(new VideoListItemView({model: videos[i]}).render().el);
        }        

        return this;
    },

});

window.VideoListItemView = Backbone.View.extend({

    // globalVariable: "yo",
     
    keyCodeMap : {
        "a":65, "b":66, "c":67, "d":68, "e":69, "f":70, "g":71, "h":72, "i":73, "j":74, "k":75, "l":76,
        "m":77, "n":78, "o":79, "p":80, "q":81, "r":82, "s":83, "t":84, "u":85, "v":86, "w":87, "x":88, "y":89, "z":90
    },

    tagName: "li",

    initialize: function () {
        _.bindAll(this);
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);  
        $(document).on('keydown', this.keydown);        
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    },

    events: {
        "click button" : "recordYo"
    },

    recordYo: function () {
        var isRecordingNow = this.model.get('isRecording')    
        if (isRecordingNow === 'false' || !isRecordingNow ) {
            this.model.set('isRecording', 'true');
        } else {
            this.model.set('isRecording', 'false');       
        }
        this.model.save();
    },

    keydown: function(e) {
        if (e.keyCode === this.keyCodeMap[this.model.get('alphabetLetter')]) {
           this.recordYo(); 
        }
        // console.log(e.type, e.keyCode, e.which);
        // console.log(this.keyCodeMap[this.model.get('alphabetLetter')]);
    }


});
