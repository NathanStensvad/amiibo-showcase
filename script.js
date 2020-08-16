'use strict';

/*I only want to implement figures as they look cooler than cards*/
const searchURL = "https://www.amiiboapi.com/api/";
var amiiboArray = [];

//to clean up names so they are id ready
function idCleanUp(idName) {
  idName = idName.split(" ").join("").replace(/[^a-zA-Z ]/g, "");
  return idName;
}

//Button functions for the main amiibos navigation page
function navigationButtonFunctions() {
  
  //Top button
  $('#js-browse-gameseries').on('click',function(e) {
    e.preventDefault();
    $('#results').addClass('hidden');
    $('#showcase').addClass('hidden');
    $('#category').removeClass('hidden');
  });

  //Top button
  $('#js-browse-all').on('click',function(e) {
    e.preventDefault();
    $('#category').addClass('hidden');
    $('#showcase').addClass('hidden');
    $('#results').removeClass('hidden');

    $('button.js-amiibos').each(function() {
      $(this).removeClass('hidden');
    });
  });

  //Top button
  $('#js-showcase').on('click',function(e) {
    e.preventDefault();
    showCase();
  });

  //All the category buttons
  $('.js-gameseries-buttons').on('click',function(e) {
    e.preventDefault();
    const buttonValue = $(this).val();
    $('#category').addClass('hidden');
    $('#results').removeClass('hidden');
    $('button.js-amiibos').each(function() {
      $(this).addClass('hidden');
    });
    $(`button#${buttonValue}`).each(function() {
      $(this).removeClass('hidden');
    });
  });

  //All the amiibo buttons
  $('.js-amiibos').on('click',function(e) {
    e.preventDefault();
    $(this).toggleClass('selected');
  });

}

//for reordering the amiibo showcase so the right ones appear in front
function compare(a, b) {
  const numberA = a.randomNumber;
  const numberB = b.randomNumber;

  let comparison = 0;
  if (numberA > numberB) {
    comparison = 1;
  } else if (numberA < numberB) {
    comparison = -1;
  }
  return comparison;
}

//Take every selected amiibo and showcase it
function showCase() {
  $('#results').addClass('hidden');
  $('#category').addClass('hidden');
  $('#showcase').removeClass('hidden');

  const showCaseArray = [];
  //I wanted to find the src from the img of the child of this but I couldn't figure out how
  $('.selected').each(function(index, element) {
    showCaseArray.push({image: $(element).val(), randomNumber: Math.random()});
  });

  showCaseArray.sort(compare);

  $('#showcase').empty();
  $('#showcase').append(`<img src="images/showcase.jpg" class="showcase"/>`);
  for(let i=0;i<showCaseArray.length;i++) {
    $('#showcase').append(`
  <img class="show amiiboImg" src="${showCaseArray[i].image}" id="${i}">
  `)
  $(`img#${i}`).css({'top': 430+(showCaseArray[i].randomNumber*120), 'left': 80+(Math.random()*1040)});
  };
}

//Check to see if the game series has an amiibo before putting a button down.
function checkForAmiibos(amiiboName) {
  const comparison = amiiboArray.amiibo.some(e => e.gameSeries === idCleanUp(amiiboName));
  return comparison;
}

//buttons for sorting amiibos
function displayGameSeriesButtons(responseJson) {
  console.log(responseJson);

  $('#category').empty();
  if(checkForAmiibos(responseJson.amiibo[0].name)) {
    $('#category').append(`<button class="js-gameseries-buttons" value="${idCleanUp(responseJson.amiibo[0].name)}" type="button" ">${responseJson.amiibo[0].name}</button>`);
  }
  for(let i=1; i<responseJson.amiibo.length;i++) {
    //Filter out multiple entries from original array
    if(responseJson.amiibo[i-1].name !== responseJson.amiibo[i].name) {
      //Make sure there are amiibos for the game series button
      if(checkForAmiibos(responseJson.amiibo[i].name)) {
        $('#category').append(`<button class="js-gameseries-buttons" value="${idCleanUp(responseJson.amiibo[i].name)}" type="button">${responseJson.amiibo[i].name}</button>`);
      }
    }
  }
  //Extra category for other entries.
  $('#category').append(`<button class="js-gameseries-buttons" value="Other" type="button">Other</button>`);
  //The navigation buttons, game series buttons, and amiibo buttons have all loaded up to this point.
  navigationButtonFunctions();
}

//Call to API to get game series buttons
function getGameSeries() {
  const url = searchURL + "gameseries";

  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayGameSeriesButtons(responseJson))
    .catch(err => {
      alert("Something went wrong here");
    });
}

//Display amiibo buttons
function displayAmiibos(responseJson) {
  console.log(responseJson);

  $('#results').empty();

  for(let i=0; i<responseJson.amiibo.length;i++) {
    $('#results').append(`
      <button type="button" class="js-amiibos" id="${responseJson.amiibo[i].gameSeries}" value="${responseJson.amiibo[i].image}">
        <img class="amiiboImg" src="${responseJson.amiibo[i].image}" alt="${responseJson.amiibo[i].name}" value="imag">
      </button>`
    );}
  getGameSeries();
}

//save the amiibo array to our const variable so we don't have to call from API again and 
//clean up array of gameSeries so they work with ids
function saveAmiiboArray(responseJson) {
  amiiboArray = responseJson;

  for(let i=0;i<responseJson.amiibo.length;i++) {
    amiiboArray.amiibo[i].gameSeries = idCleanUp(responseJson.amiibo[i].gameSeries);
  }

  displayAmiibos(amiiboArray);
}

//Call to API to get amiibo list
function getAPI() {
  //const url = searchURL + "amiibo";
  const url = searchURL + "amiibo/?type=figure";

  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => saveAmiiboArray(responseJson))
    .catch(err => {
      alert("Something went wrong");
    });
}

//Calls to APIs and button functions
function renderAmiibos() {
  $('#results-screen').removeClass('hidden');
  getAPI();
}

function homePage() {
  $('#js-browse').on('click', function(e) {
    e.preventDefault();
    $('#home').addClass('hidden');
    renderAmiibos();
  });
}

homePage();