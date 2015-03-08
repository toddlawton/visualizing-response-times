var app =  app || {};

app.AppView = Backbone.View.extend({
    
    el: '.container',

    events: {

    },

    initialize: function() {
        this.collection = new app.ResponseEntityCollection();
        var self = this;
        this.render();
        this.collection.listenTo(this.collection, 'add', function(item){
            self.renderEntity(item);
        });
        this.collection.add( new app.ResponseEntity({url: 'http://secure.alphasights.com/health.json', title: 'AlphaSights'}) );


        setTimeout(function(){
            self.collection.add( new app.ResponseEntity({url: 'https://status.heroku.com', title: 'Heroku'}) );    
        }, 2500);

        setTimeout(function(){
            self.collection.add( new app.ResponseEntity({url: 'https://google.com', title: 'Google'}) );    
        }, 5000);
    },

    render: function() {
        this.collection.each(function(item){
            this.renderEntity(item);
        }, this);
    },

    renderEntity: function(item) {
        var entityView = new app.ResponseView({
            model: item
        });
        this.$el.append(entityView.render().el);
    }

});