So far this system is build and tested on mac computers, but all components used are available for windows machines as well, so if anyone is interested in porting any of this to windows (i think the only thing that needs porting is the start-up automation).

# Startup Process

## Wifi Setup

In order to be able to communicate between external controllers and the visulization we need to build a wireless network, so other devices can connect.
This is an apple script taken from https://www.svenbit.com/2011/02/create-a-new-wireless-network-ad-hoc-on-mac-os-using-an-applescript/

AppleScript:

property CreateMenuName : "Create Network…"
property NetworkName : "Net"
property NetworkPassword : "paswd"
 
tell application "System Events"
	tell process "SystemUIServer"
		tell menu bar 1
			set menu_extras to value of attribute "AXDescription" of menu bar items
			repeat with the_menu from 1 to the count of menu_extras
				if item the_menu of menu_extras is "Airport Menu Extra" then exit repeat
			end repeat
			tell menu bar item the_menu
				perform action "AXPress"
				delay 0.2
				perform action "AXPress" of menu item CreateMenuName of menu 1
			end tell
		end tell
		repeat until exists window 1
			delay 0.5
		end repeat
		tell window 1
			click checkbox 1
			click pop up button 2
			click menu item 1 of menu 1 of pop up button 2
			set value of text field 2 to NetworkPassword
			set value of text field 3 to NetworkPassword
			set value of text field 1 to NetworkName
			click button 1
		end tell
	end tell
end tell

## Wait for Wifi to Setup

After building the wifi network, we just wait for a few minutes, in the future there should be a script that tries to figure out if the network was setup successfully.

## Main Components

Next, we will fire up the main components using terminal commands

### Web-Server

Instead of using some custom terminal thingy. We are using MAMP, because we are lazy.
//Alternative: sudo launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist
//http://macs.about.com/od/usingyourmac/ss/Automate-Opening-Multiple-Applications-And-Folders.htm#step2
//https://discussions.apple.com/thread/2035098?start=0&tstart=0
//https://www.raywenderlich.com/58986/automator-for-mac-tutorial-and-examples
//http://radarearth.com/content/automate-terminal-automator

### Tile-Server

### MySQL Database

MAMP takes care of this
//(if installed via port) sudo port load mysql5-server

### Postgres Database

### Socket.io

## Visualization Components

If we need additional components, obviously they need to be launched at start-up.
Therefore a visualization that needs additional services, should have its own startup automation code, specified in the package.json, in the format:

for a simple terminal command, e.g. launch a node.js service:

{
	type:'terminal',
	value:'terminal command'
}

or to open an app:

{
	type:'app',
	value:'name_of_app'
}

## Wait for components

We will give all those components some time to start, it will probably be trick to write a checker for all those components to figure out if they are running, so we just need to wait for a while to be sure

## Launch Browser and website

Launching the browser in full screen mode and opening the framework's main page, the page will then display the default visualization, which displays the URL that external devices can use to fire up the controller interface.




## Installing components - First Time Use

MySQL
- http://www.sequelpro.com/docs/Install_MySQL_on_your_Mac

Node
Install Node

TileServer
- Packages
- http://osm2vectortiles.org/
- http://osm2vectortiles.org/docs/create-map-with-mapbox-studio-classic/

SocketIO
- http://socket.io/

PostgreSQL

