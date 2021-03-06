var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "videos"			: "list",
        "videos/add"        : "addVideo",
        "videos/:id"        : "videoDetails"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function() {
        var videoList = new VideoCollection();
        videoList.fetch({success: function(){
            $("#content").html(new VideoListView({model: videoList}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    videoDetails: function (id) {
        var video = new Video({_id: id});
        video.fetch({success: function(){
            $("#content").html(new VideoView({model: video}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addVideo: function() {
        var video = new Video();
        $('#content').html(new VideoView({model: video}).el);
        this.headerView.selectMenuItem('add-menu');
        console.log("word")
	}

});

utils.loadTemplate(['HomeView', 'HeaderView', 'VideoView', 'VideoListItemView'], function() {
    app = new AppRouter();
    // Backbone.history.start({pushState: true});
    Backbone.history.start();    
});