# HuluSkipper
A Chrome extension designed to automatically detect and skip hulu ads. This extension is automatically enabled and disabled depending on the current URL being served.

![Extension](https://i.imgur.com/g2HWq47.png)

# Functional Overview
## Manifest.json
This is the file that sets up all naming, icons, and permissions. It is run when chrome is opened, and the extension is enabled. This file is also the main disbatch service. After initial setup, the background.js service is disbatched. When the URL matches the widlcard: "*://*.hulu.com/", the manifest disbatches and runs the StartContentScript.js.

## Background.js
This service monitors the current state of a chrome tab, and disbatches commands/messages to the content script. When a specific URL matches a RegX, the service knows we are on hulu's content server and watching content. From here, it notifies the content script that we are on the correct url, what type of content is beign served (ad or not), and weather or not to begin the ad-skipping service.

## StartContentScript.js
This service is a "slave" to the background service. It responds to the commands disbatched, as well as requests updates from the background service. When the ad-skipping service is commanded to begin, this script binds a display change listener. This listener searces for a className: "ad-top-bar-container". When this class is found, we know we are being served and ad. From here, the script searches for the className: 'video-player', and attaches to it in order to change the playback speed (Skipping through the ad very fast). It continues this until the display change listener notifies it that we are no longer being served an ad. 
