# playcanvas-sections-occlusion-system
A simple free plug-and-play sections/portals system to define volumes of visibility. It helps to occlude entities and increase performance when they aren’t visible on screen, but still inside the camera frustrum.

### How it works?
The system on initialization creates a bounding box for each occluder. On runtime it checks if the position of the camera is contained in the bounding boxes. If it is contained then all entities for that section are enabled.

### How to setup?
1. You attach the section-system.js script to a section entity and set up the tags that are used for this section.
2. You have to create one or more occluder entities that have a box collision component defining the visibility areas. These entities have to be tagged accordinigly and be children of the section entity.
3. You tag your occludees which are basically all the entities you would like to trigger their state for this section. These entities have to be children of the section entity.
4. You tag your cameras which can be global for all sections. If they are active (enabled === true) they will be tested one after the other against the occluders. If a camera is inside an occluder all entities will be enabled for that section.

### Where to use it in my project?

- You can setup sections and gain a nice performance boost from the reduced draw calls and polycount. Combined with the new batching system it can help a lot, especially on mobile.
- You can enable the broadcast property on the script and you will get enabled/disabled events for a section. Which you can subscribe to from your scripts, like this:
```
this.app.on("Sections:Section Name:enabled", function(){
   // switch on the lights
}, this);
```
- You can switch off the staticOccluders property for a section and be able to move it during runtime. The visibility checks will adapt accordingly.
- You can configure the interval property of a section which sets how often it will trigger visibility checks.

Here is a public project example:
https://playcanvas.com/project/548975/overview
