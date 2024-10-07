const testingData = {
  "routes": [
    {
      "distanceMeters": 43573,
      "duration": "5775s",
      "staticDuration": "4281s",
      "description": "A406",
      "localizedValues": {
        "distance": {
          "text": "27.1 mi"
        },
        "duration": {
          "text": "1 hour 35 mins"
        },
        "staticDuration": {
          "text": "1 hour 11 mins"
        }
      },
      "routeLabels": ["DEFAULT_ROUTE"]
    },
    {
      // "distanceMeters": 23682,
      "distanceMeters": 42682,
      "duration": "5829s",
      "staticDuration": "4158s",
      "description": "A40",
      "localizedValues": {
        "distance": {
          "text": "14.7 mi"
        },
        "duration": {
          "text": "1 hour 36 mins"
        },
        "staticDuration": {
          "text": "1 hour 9 mins"
        }
      },
      "routeLabels": ["DEFAULT_ROUTE_ALTERNATE"]
    },
    {
      "distanceMeters": 23062,
      "duration": "5994s",
      "staticDuration": "4065s",
      "description": "A315",
      "warnings": ["This route has tolls."],
      "localizedValues": {
        "distance": {
          "text": "14.3 mi"
        },
        "duration": {
          "text": "1 hour 40 mins"
        },
        "staticDuration": {
          "text": "1 hour 8 mins"
        }
      },
      "routeLabels": ["DEFAULT_ROUTE_ALTERNATE"]
    }
  ]
}
let primaryData = testingData.routes[0];
// data.routes.sort((a, b) => a.distanceMeters - b.distanceMeters) // small to big sorted
if (testingData.routes.length > 1) {
  let firstDuration = parseFloat(testingData.routes[0].duration.replace("s", ""));
  let secondDuration = parseFloat(testingData.routes[1].duration.replace("s", ""));
  // if the first route is over 20% longer but the duration is not 20 percent longer - choose the second route - as first route is rerouting to a longer route
  if (testingData.routes[0].distanceMeters > testingData.routes[1].distanceMeters * 1.2 && firstDuration * 1.2 >= secondDuration) {
    primaryData = testingData.routes[1]
  }
}
console.log(primaryData);