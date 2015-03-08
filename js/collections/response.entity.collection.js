app.collections.responseEntities = Backbone.Collection.extend({

    model: app.models.responseEntity,

    localStorage: new Backbone.LocalStorage('responseEntities')

});

app.responseEntities = new app.collections.responseEntities();