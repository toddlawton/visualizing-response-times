/**
 * Collection: Response Entities
 * A response time monitoring object instance collection
 */

app.collections.responseEntities = Backbone.Collection.extend({

    model: app.models.responseEntity,

    localStorage: new Backbone.LocalStorage('responseEntities')

});

app.responseEntities = new app.collections.responseEntities();