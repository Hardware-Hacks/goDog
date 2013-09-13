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

   events: {
        "click button": "recordYo"
    },

    recordYo: function(event){
      $(event.currentTarget).toggle(
            function() {
                $(event.currentTarget).removeClass('btn-danger').addClass('btn-success');
            },
            function() {
                $(event.currentTarget).removeClass('btn-success').addClass('btn-danger');
            }
        );
        console.log(event.target);
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
    }

});