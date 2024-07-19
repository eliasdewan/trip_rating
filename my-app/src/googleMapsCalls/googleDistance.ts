// npm install node-fetch

export async function fetchGoogleMapsData(origin: string, destination: string, call: boolean = true, traffic_model = "best_guess") {
  console.log(origin, destination)
  const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  const queryParams = new URLSearchParams({

    origins: origin,
    destinations: destination,
    units: 'imperial',
    key: 'AIzaSyDso8ZpnTpAeWsnveJaKyA57nt2Eyqgj5I',
    departure_time: Date.now().toString(),
    traffic_model
    // pessimistic and optimistic
  })


  // Create a URL with the parameters
  const compleUrl = `${url}?${queryParams}`
  console.log(compleUrl);
  // Just return url if not calling
  if (!call) {
    return compleUrl
  }


  return await fetch(compleUrl, {
    method: 'GET', // Since we are using GET, we don't need to specify the body
    headers: {
      'Content-Type': 'application/json' // Optional, usually not necessary for GET requests
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse the JSON from the response
    })
    .then(data => {
      console.log('Success:', data); // Handle the JSON data from the response
      return data;
    })
    .catch(error => {
      console.error('Error:', error); // Handle any errors that occur
    });
}
