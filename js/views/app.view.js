app.views.appView = Backbone.View.extend({
    
    el: '.container',

    responseEditTemplate: _.template($('#response-entity-edit-template').html()),

    events: {

    },

    initialize: function() {
        app.responseEntities = new app.collections.responseEntities();
        var self = this;
        var headerView = new app.views.headerView({ el: $('.header') });

        this.render();
        
        app.responseEntities.listenTo(app.responseEntities, 'add', function(item){
            self.renderEntity(item);
        });

        // app.responseEntities.add( new app.models.responseEntity({url: 'http://secure.alphasights.com/health.json', title: 'AlphaSights'}) );
        // app.responseEntities.add( new app.models.responseEntity({url: 'https://status.heroku.com', title: 'Heroku'}) );    
        // app.responseEntities.add( new app.models.responseEntity({url: 'https://google.com', title: 'Google'}) );    

        app.responseEntities.fetch()
    },

    render: function() {
        app.responseEntities.each(function(item){
            this.renderEntity(item);
        }, this);
    },

    renderEntity: function(item) {
        var entityView = new app.views.responseView({
            model: item
        });
        this.$el.append(entityView.render().el);
    },

    saveEntity: function() {

    }

});