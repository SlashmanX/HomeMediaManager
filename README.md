HomeMediaManager
===========

A web interface that helps control your media library.

Features
=======
* View your XBMC library in your browser
* Download missing episodes for your shows through Transmission
* Download Movies/TV Shows/General files to your hard drive using Transmission
* Stream Movies and TV Shows in your browser
* Login authentication with Basic-Auth
* Optionally show football fixtures and league tables

Instructions
=======
* Clone the repository to your hard drive using `git clone https://github.com/SlashmanX/HomeMediaManager.git`
* Navigate to the clone repo using `cd HomeMediaManager` 
* Install the required modules with `npm install`
* Rename `conf/settings.json.sample` to `conf/settings.json` and edit the settings as needed
* Run `npm start` (or `node ./bin/www`) and visit `localhost:3000` in your browser
