/**
 * Views: App View
 * Main view for rendering the response entity collection
 */

app.views.appView = Backbone.View.extend({
    
    el: '.container',

    responseEditTemplate: _.template($('#response-entity-edit-template').html()),

    events: {},

    initialize: function() {
        app.responseEntities = new app.collections.responseEntities();
        var self = this;
        var headerView = new app.views.headerView({ el: $('.header') });

        this.render();
        
        app.responseEntities.listenTo(app.responseEntities, 'add', function(item){
            self.renderEntity(item);
        });

        app.responseEntities.fetch()

        // For demonstration purposes, if no entity exists in localStorage, 
        // add several new ones
        
        if (app.responseEntities.length === 0) {
            var demoEntities = [
                {url: 'http://secure.alphasights.com/health.json', title: 'AlphaSights'},
                {url: 'https://status.heroku.com', title: 'Heroku'},
                {url: 'https://google.com', title: 'Google'}
            ];
            demoEntities.forEach(function(entity){
                newEntity = new app.models.responseEntity(entity);
                app.responseEntities.add(entity);
            });
        }

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
    }

});