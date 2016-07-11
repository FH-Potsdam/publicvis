# publicvis
**Framework for presenting visualizations in exhibitions, public demonstration or similar use cases**

The idea behind this framework is to create a robust environment to run web-based visualization (information visualization, geovisualization, maps, etc.) on an autonomous system.

## Basic Technology Stack

- A Mac computer with some kind of display (projector, displays, etc.)
- On start-up a series of process are being executed (starting web-server, staring tile-server, etc.) for more information see ./startup-automation
- A socket.io backbone serves as a communication backend between visualization and control-unit ./framework
- The visualizations are embedded in an iframe 
- The web-framework allows external units to connect via socket.io to control the visualization ./framework/controller
- The visualization themselves are standalone html pages ./visualization

Normally you don't need to modify the framework, you just create new visualizations

## Design & Coding Guidelines for the Visualizations

- Every visualizations should sit in its own folder
- Inside that folder, there need to be two things at the root of this folder:
	1. package.json - containing meta information on the project
	2. index.html - This is where the magic happens
- In addition there can be more things, see ./projects/example
- All libraries and external material needs sit in the vis folder, do not keep them on a global level, just keep them inside the specific visualization project. Yes, this will result in a lot of duplicate libraries, etc. But 1. the system needs to work offline, so no CDNs no externally hosted material 2. As projects evolve and people leave, its a good thing to keep the projects wrapped, even if this means having duplicates.
- If your project requires a certain server side service, that is not included in the framework, add it to the start-up automation service
- The framework offers a channel of communication between visualization and controller, see ./projects/example
- Visualizations do not need to be really responsive (As screen-size will not change after once set up) but they need to use the with and height of the page that they are being loaded into, there is no option for scrolling, so for css use %-sizes and for things like d3 get the boundingRect of the visualization container. The reason for this is, that depending on the display technology the resolution etc. will vary.