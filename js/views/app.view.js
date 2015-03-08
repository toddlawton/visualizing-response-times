var app =  app || {};

app.views.appView = Backbone.View.extend({
    
    el: '.container',

    events: {

    },

    initialize: function() {
        app.responseEntities = new app.collections.responseEntities();
        var self = this;
        this.render();
        
        app.responseEntities.listenTo(app.responseEntities, 'add', function(item){
            self.renderEntity(item);
        });

        // app.responseEntities.add( new app.models.responseEntity({url: 'http://secure.alphasights.com/health.json', title: 'AlphaSights'}) );

// app.responseEntities.add( new app.models.responseEntity({url: 'https://status.heroku.com', title: 'Heroku'}) );    
        // setTimeout(function(){
        //     app.responseEntities.add( new app.models.responseEntity({url: 'https://status.heroku.com', title: 'Heroku'}) );    
        // }, 2500);

        // setTimeout(function(){
        //     app.responseEntities.add( new app.models.responseEntity({url: 'https://google.com', title: 'Google'}) );    
        // }, 5000);

        // app.responseEntities.each(function(entity){
        //     entity.save();
        // });
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