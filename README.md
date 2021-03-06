# Neighborhood Map Project

## Overview
This is a single-page application featuring a map of a chosen neighborhood.
The application functionality includes:
- Map Markers to identify locations/places
- A search function to easily discover these locations
- A listview to support simple browsing of all locations.

![Alt text](https://github.com/triminhvi/FEND-NeighborHood-Map/blob/master/img/screenshot_01.png)

The application is built with Knockout.js, Google Maps API, and Foursquare API.

## How to get started
Experience the live demo application at https://triminhvi.github.io/FEND-NeighborHood-Map/

To explore more about the code:
1. Visit https://github.com/triminhvi/FEND-NeighborHood-Map
2. Clone or download the repository.
3. Extract zip file.
4. Feel free to explore the html, cs, js files.


## Application Functionality

1. The application uses Google Maps API. to initlize the map of a chosen neighborhood.
2. The application collects infomation data of the locations by performing ajax request from Foursquare API.
3. The application notifies users in an error occures.
4. The right sidebar of the application displays all locations from Ajax request and a search box. The search box helps filtering out the location faster.
5. Clicking on the location name will trigger the bounce function of the marker and display addition information of the place in the infoWindow.

