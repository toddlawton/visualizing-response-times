var entityCollection = new app.collections.responseEntities();
var entity = new app.models.responseEntity();
var mockModelData = {url: 'http://secure.alphasights.com/health.json', title: 'AlphaSights'};

describe("Response Entity", function(){

    describe("When an entity is initialized:", function(){
        it("It should be an instance of the entity data model", function(){
            expect(entity).to.be.an.instanceof(app.models.responseEntity);
        });
        it("It should have a title.", function() {
            expect(entity.get('title')).not.null;
        });
        it("It should have a url.", function() {
            expect(entity.get('url')).not.null;
        });
        it("It should have an initial response time of zero.", function() {
            expect(entity.get('responseTime')).to.equal(0);
        });
    });

    describe("When an entity is added to an empty collection:", function(){
        entityCollection.add( new app.models.responseEntity(mockModelData) );
        var firstCollectionItem = entityCollection.at(0);

        it("The collection should have a length of one.", function(){
            expect(entityCollection).to.have.length(1);
        });

        it("The first item in the collection should have a title which matches the input title.", function(){
            expect(firstCollectionItem.get('title')).to.equal(mockModelData['title']);
        });

        it("The first item in the collection should have a url which matches the input url.", function(){
            expect(firstCollectionItem.get('url')).to.equal(mockModelData['url']);
        });
    });


    var renderSpy = sinon.spy(app.views.responseView.prototype, 'render'),
        requestSpy = sinon.spy(app.views.responseView.prototype, 'sendRequest');

    var responseEntityView = new app.views.responseView({ model: new app.models.responseEntity(mockModelData) });
    $('.container').append(responseEntityView.render().el);


    describe("When an entity view is initialized:", function(){

        it("The render function should have been called.", function(){
            expect(renderSpy).to.have.been.called;    
        });

        it("The request function should have been called with the model's url.", function(){
            url = mockModelData.url;
            expect(requestSpy).to.have.been.calledWith(url);    
        });
    });

    describe("When an entity view is rendered:", function(){
        it("The entity's title label in the DOM should match the model's title.", function(){
            expect(responseEntityView.$el.find('.entity-title').html()).to.be.equal(mockModelData['title']);
        });

        it("The entity's time label in the DOM should match the model's response time.", function(){
            expect(responseEntityView.$el.find('.entity-subtitle').html()).to.be.equal(responseEntityView.model.attributes['responseTime']+'ms');
        });
    });
});