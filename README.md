# playcanvas-sections-occlusion-system
A simple free plug-and-play sections/portals system to define volumes of visibility. It helps to occlude entities and increase performance when they aren’t visible on screen, but still inside the camera frustrum.

![playcanvas-sections-occlusion-system-1](https://forum-files-playcanvas-com.s3-eu-west-1.amazonaws.com/optimized/2X/f/f2b7dfef7ff83ca623306cd8d7040222030eb541_1_690x424.gif)

### How it works?
The system on initialization creates a bounding box for each occluder. On runtime it checks if the position of the camera is contained in the bounding boxes. If it is contained then all entities for that section are enabled.

### How to setup?
1. You attach the section-system.js script to a section entity and set up the tags that are used for this section.
2. You have to create one or more occluder entities that have a box collision component defining the visibility areas. These entities have to be tagged accordinigly and be children of the section entity.
3. You tag your occludees which are basically all the entities you would like to trigger their state for this section. These entities have to be children of the section entity.
4. You tag your cameras which can be global for all sections. If they are active (enabled === true) they will be tested one after the other against the occluders. If a camera is inside an occluder all entities will be enabled for that section.

![playcanvas-sections-occlusion-system-2](https://forum-files-playcanvas-com.s3-eu-west-1.amazonaws.com/original/2X/3/3fb5f1b2e87917bc4dc1eb1c61fc6d466128b0b8.png)

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

![playcanvas-sections-occlusion-system-3](https://forum-files-playcanvas-com.s3-eu-west-1.amazonaws.com/optimized/2X/0/0fabfaca29faaa440a64c70730d40190ef044ac4_1_690x430.png)
