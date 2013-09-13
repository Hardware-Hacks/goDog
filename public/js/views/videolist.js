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
    }      
});

window.VideoListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);  
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    },

    events: {
        "click button" : "recordYo",

    },

    recordYo: function () {
        var isRecordingNow = this.model.get('isRecording')    
        if (isRecordingNow === 'false') {
            this.model.set('isRecording', 'true');
        } else {
            this.model.set('isRecording', 'false');       
        }

        this.model.save()
    }



});