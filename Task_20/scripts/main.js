// Foursquare API info
const clientId = 'PQ4CNK2WPSBWXOWC1WG0XY4QYK5H1BNP4WREYAYJ2TVWIA2P';
const clientSecret = 'ANEYWWK5JG1OYQJIIZSE3JUGFJZV0ERAGCOSVZDCIOEPWL0O';
const actualDate = new Date();
let [day, month, year] = [actualDate.getDate(), actualDate.getMonth() + 1, actualDate.getFullYear()];
if (day < 10) { day = "0" + day; }
if (month < 10) { month = "0" + month; }

const version = "&v=" + year + month + day;
const url = `https://api.foursquare.com/v2/venues/explore?client_id=${clientId}&client_secret=${clientSecret}${version}&near=`;

// Additional info
const limit = "&limit=10";

// OpenWeather info
const openWeatherKey = '16046bb034c924231a782572aee60e74';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}${limit}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      return venues;
    } else {
      console.error('Error fetching venues:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
}

const getForecast = async () => {
  const city = $input.val();
  const urlToFetch = `${weatherUrl}?q=${city}&appid=${openWeatherKey}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      console.error('Error fetching weather:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

// Render functions
const renderVenues = (venues) => {
  if (venues && venues.length > 0) {
    $venueDivs.forEach(($venue, index) => {
      const venue = venues[index];
      if (venue) {
        const venueIcon = venue.categories[0].icon;
        const venueImgSrc = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
        let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
        $venue.append(venueContent);
      }
    });
    $destination.append(`<h2>${venues[0].location.city}</h2>`);
  } else {
    $destination.append('<p>No venues found.</p>');
    console.error('No venues found.');
  }
}

const renderForecast = (forecast) => {
  if (forecast) {
    let weatherContent = createWeatherHTML(forecast);
    $weatherDiv.append(weatherContent);
  } else {
    $weatherDiv.append('<p>Weather information not available.</p>');
    console.error('Weather information not available.');
  }
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");

  
  Promise.all([getVenues(), getForecast()])
    .then(([venues, forecast]) => {
      renderVenues(venues);
      renderForecast(forecast);
    })
    .catch(error => console.log('Error during search:', error));

  return false;
}

$submit.click(executeSearch);
