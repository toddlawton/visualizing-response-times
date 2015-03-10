/**
 * Models: Response Entity
 * An instance of a response time monitoring object
 */

app.models.responseEntity = Backbone.Model.extend({
    defaults: {
        url: 'http://example.com',
        title: 'Example Title',
        responseTime: 0,
        newEntity: true
    }
});