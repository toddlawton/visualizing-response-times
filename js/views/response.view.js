app.views.responseView = Backbone.View.extend({

    tagName: 'div',

    className: 'response-entity',

    responseViewTemplate: _.template($('#response-entity-template').html()),

    responseEditTemplate: _.template($('#response-entity-edit-template').html()),

    events: {
        "click .orbiter-container": "edit",
        "click #entity-edit-cancel": "closeEditModal"
    },

    initialize: function() {
        var self = this;

        this.firstRun = true;
        this.refreshInterval = app.configs.pingRefreshInterval; // Wait this number of milliseconds before re-sending the request
        this.maximumResponse = app.configs.responseThreshold; // At this reponse time the speed will be nearly 0
        
        this.refresh = setInterval(function(){
            self.sendRequest( self.model.get('url') );
        }, self.refreshInterval);

        $('#entity-edit-cancel').on('click', self.closeEditModal);
    },

    render: function() {
        this.model.set('newEntity', false);
        this.$el.html( this.responseViewTemplate( this.model.attributes ) );

        this.$orbiter = this.$el.find('.orbiter');
        this.$orbiterContainer = this.$('.orbiter-container');
        this.$responseTimeLabel = this.$el.find('.entity-subtitle');

        this.sendRequest( this.model.get('url') ); // Send a request immediately upon initialization
        
        return this;
    },

    edit: function() {
        var self = this;
        this.$modal = '';
        this.dialog = this.$el.avgrund({
            height: 340,
            holderClass: 'modal-container',
            enableStackAnimation: false,
            openOnEvent: false,
            onBlurContainer: '.container',
            onReady: function() {
                self.$modal = $('.modal-container');
                self.$modal.html( self.responseEditTemplate( self.model.attributes ) );
                self.bindModalEvents();
            },
            template: ''
        });
    },

    bindModalEvents: function() {
        var self = this;
        this.$modal.find('#entity-edit-save').on('click', $.proxy(self.saveEditModal, self));
        this.$modal.find('#entity-edit-cancel').on('click', self.closeEditModal);
        this.$modal.find('#entity-edit-delete').on('click', $.proxy(self.deleteEditModal, self));
    },

    closeEditModal: function() {
        $('.avgrund-overlay').trigger('click');
    },

    saveEditModal: function() {
        var self = this;
        $('.modal-container input').each(function(){
            var modelAttribute = $(this).data('model-attr');
            if (modelAttribute) {
                self.model.set(modelAttribute, $(this).val());
                self.model.save();
            }
        });
        self.render();
        this.closeEditModal();
    },

    deleteEditModal: function() {
        this.model.destroy();
        this.remove();
        this.closeEditModal();
    },

    /**
     * Record the time difference between the request and response of a GET
     * and update the model for this response time entity.
     * @param  {string} url The URL to GET
     */
    sendRequest: function(url) {
        var self = this,
            initialTime = new Date().getTime(); // Record the time before the GET

        $.ajax({
            url: url+'?'+new Date().getTime(),
            dataType: 'json',
            type: 'get',
            complete: function() {
                var finishedTime = new Date().getTime(), // Record the time after the GET
                    timeDelta = finishedTime-initialTime; // Measure the time difference
                self.model.set('responseTime', timeDelta); // Update the model with the new response time
                self.calculateOrbiter(timeDelta);
            }
        })
    },

    /**
     * Calculate x & y coordinates of a point as it travels in a circular motion
     */
    applyAngle: function(point, angle, distance) {
        return {
            x: Math.round(point.x + (Math.cos(angle) * distance)),
            y: Math.round(point.y + (Math.sin(angle) * distance))
        }
    },

    /**
     * Apply calculated coords to the orbiter at an interval determined by requestAnimationFrame
     */
    startOrbiterAnimation: function() {
        var self = this;

        // Generate x & y coords for the orbiter for each angle in the circle
        this.updateOrbiter = function() {
            this.pos = this.applyAngle(this.centerPoint, this.angle, this.radius),
            this.angleStep = 0.1 * this.speedRatio;
            this.angle += this.angleStep;

            this.$orbiter.css({
                left: this.pos.x + this.radius,
                top: this.pos.y,
                transform: 'scale('+this.scaleRatio+')',
                backgroundColor: this.orbiterColor
            });
        }

        this.$el.addClass('visible');

        function animloop(){
          window.requestAnimationFrame(animloop);
          self.updateOrbiter();
        };

        animloop();
    },

    /**
     * Calculate values for position, speed and color based on response time
     * @param  {integer} responseTime The difference in milliseconds between the request and response of the GET
     */
    calculateOrbiter: function(responseTime) {
        var self = this;
        this.$container = this.$el;

        // Update the response time in the view
        this.$responseTimeLabel.html(responseTime+'ms');

        this.pos = {};
        this.radius = this.$orbiterContainer.width() / 2;
        this.angle = this.angle || 0;

        // Set a fast animation speed for quick response times, set no animation if there is a failure
        responseTime = Math.abs(responseTime);
        responseTime = Math.min(this.maximumResponse, responseTime);

        this.speedRatio = 1-(responseTime/this.maximumResponse); // 0 to 1
        this.scaleRatio = (app.configs.orbiterMinimumScale*0.01)+(responseTime/this.maximumResponse);
        
        if (this.speedRatio === 0) { this.speedRatio = 0.025; }
        this.intervalRefreshRate = 16; 

        // If the animation has already run, use existing coords, otherwise generate new ones
        this.centerPoint = {
            x: this.pos.x || this.$container.width() / 2,
            y: this.pos.y || this.$container.height() / 2
        };

        // Adjust hue of orbiter based on the response time
        var h = Math.floor(120*(1-(responseTime/this.maximumResponse))),
            s = 0.75,
            v = 0.9;

        this.orbiterColor = app.utils.hsv2rgb(h, s, v);

        if (this.firstRun) {
            this.startOrbiterAnimation();
            this.firstRun = false;
        }
    }
});