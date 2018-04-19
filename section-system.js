var SectionSystem = pc.createScript('sectionSystem');

SectionSystem.attributes.add('occluderTag', {
    type: 'string',
    default: 'section-occluder',
    description: 'Specify a tag used to identify the occluders in this section. These are the volumes that defines the visible parts of the section. Only entities with a box collision component are supported.'
});

SectionSystem.attributes.add('occludeeTag', {
    type: 'string',
    default: 'section-occludee',
    description: 'Specify a tag used to identify objects that will be occluded. These are the entities that their enabled state will be disabled as soon as a camera steps out of this section.'
});

SectionSystem.attributes.add('cameras', {
    type: 'string',
    default: 'section-camera',
    description: 'Specify a tag used to identify the cameras this section will work with. You can specify an arbitary list of cameras and only the enabled ones will be checked on each interval.'
});

SectionSystem.attributes.add('interval', {
    type: 'number',
    default: 0.3,
    description: 'Specify the interval in seconds on which this section will update. A smaller interval means more section checks per seconds, which might have a performance impact.'
});

SectionSystem.attributes.add('staticOccluders', {
    type: 'boolean',
    default: true,
    description: 'Specify if occluders are static. Otherwise their bounding box will be updated on each interval. This has a performance impact.'
});


SectionSystem.attributes.add('broadcast', {
    type: 'boolean',
    default: true,
    description: 'Fire an app-wide event on section state change.'
});


// initialize code called once per entity
SectionSystem.prototype.initialize = function() {
  
    
    // --- variables
    this.nullVec = new pc.Vec3();
    
    this.occludersList = undefined;
    this.boundingBoxes = undefined;
    this.occludeesList = undefined;
    this.camerasList = undefined;
    
    this.currentState = undefined;
    
    this.accumulator = 0.0;
    
    
    // populate lists once in start up
    this.populateLists();
    
    // set occludees state to disabled initially
    this.setOccludeState(false, false);
    

};


// update code called every frame
SectionSystem.prototype.update = function(dt) {


    this.accumulator += dt;
   

    // update only if the specified interval has passed
    if( this.accumulator >= this.interval ){

        this.accumulator = 0.0;
        
        
        if( this.staticOccluders === false ){
            this.updateOccluders();
        }

        this.checkAndOcclude();
    }

};


SectionSystem.prototype.populateLists = function(){
  
    
    // get entities by tag
    this.occludersList = this.entity.findByTag(this.occluderTag);
    this.boundingBoxes = [];
    this.occludeesList = this.entity.findByTag(this.occludeeTag);
    this.camerasList = this.app.root.findByTag(this.cameras);
    
    
    // check if occluders have a collision component, if they have create a bounding box
    var i = this.occludersList.length;
    while (i--) {
        
        var occluder = this.occludersList[i];
        
        if( occluder.collision && occluder.collision.type === 'box' ){

            var bounding = this.createBoundingBox(occluder.getPosition(), occluder.collision.halfExtents);

            this.boundingBoxes.push( bounding );
        }
    }
};



SectionSystem.prototype.createBoundingBox = function(center, halfExtents){

    return new pc.BoundingBox(center, halfExtents);
};



SectionSystem.prototype.setOccludeState = function(state, events){
    
    if( this.occludeesList === null ){ return false; }
    if( this.currentState === state ){ return false; }
    
    
    // loop through occludees and set state
    var i = this.occludeesList.length;
    while (i--) {
        
        if( this.occludeesList[i] ){
            this.occludeesList[i].enabled = state;   
        }
    }
    
    this.currentState = state;
    
    
    if( this.broadcast === true && events === true ){
        
        if( state === true ){
            this.app.fire('Sections:'+this.entity.name+':enabled');  
        }else{
            this.app.fire('Sections:'+this.entity.name+':disabled');
        }

    }
};



SectionSystem.prototype.checkAndOcclude = function(){
  
    
    // check if everything is in place to check with
    if( this.boundingBoxes === null ){ return false; }
    if( this.occludeesList === null ){ return false; }
    if( this.camerasList === null ){ return false; }
    
    
    // loop through all enabled cameras and check against the occluders
    var i = this.camerasList.length;
    var inside = false;
    
    while (i--) {
        
        var camera = this.camerasList[i];
        
        if( camera.enabled === false ){
            continue;
        }
        
        
        // loop through all occluders and check active camera if it is inside of a bounding box
        var j = this.boundingBoxes.length;
        
        var cameraPos = camera.getPosition();
        
        while (j--) {

            var occluder = this.boundingBoxes[j];

            // if an occluder contains the camera, break from this loop, no need for additional testing
            if( occluder.containsPoint( cameraPos ) === true ){
                inside = true;
                break;
            }
        }
        
        if( inside === true ){            
            break;
        }
    }
    
                
    this.setOccludeState(inside, true);
};



SectionSystem.prototype.updateOccluders = function(){
    
    
    // loop through all occluders and check active camera if it is inside of a bounding box
    var i = this.occludersList.length;

    while (i--) {

        var occluder = this.occludersList[i];
        var bounding = this.boundingBoxes[i];

        // update bounding box
        bounding.center = occluder.getPosition();
        bounding.halfExtents = occluder.collision.halfExtents;
        
        bounding._min.copy(this.nullVec);
        bounding._max.copy(this.nullVec);
    }
};
