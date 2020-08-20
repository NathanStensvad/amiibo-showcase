'use strict';

/*I only want to implement figures as they look cooler than cards*/
const searchURL = "https://www.amiiboapi.com/api/";
var amiiboArray = [];
var showCaseArray = [];

//to clean up names so they are id ready
function idCleanUp(idName) {
  idName = idName.split(" ").join("").replace(/[^a-zA-Z ]/g, "");
  return idName;
}

//Buttons for the showcase screen
function showcaseButtons() {
  $('#js-go-back').on('click', function () {
    $('#showcase').addClass('hidden');
    $('#results').removeClass('hidden');
    //Bandaid fix for spacing out amiibos
    $('#results').addClass('results-flex');
    //Bandaid fix for hiding options
    $("#options-hide").removeClass("hidden");
  });

  //This basically functions as the showcase button
  $('#js-reroll').on('click', function () {
    showCase();
  });
}

//Download image button to download the canvas
function downloadImageButton() {
  $('#js-download-showcase').remove();
  $('#download-button').append(`<a href="#" class="button" id="js-download-showcase" download="Amiibo_ShowCase"><img id="download" src="images/download.png" alt="Download"></a>`);

  var button = document.getElementById('js-download-showcase');

  $('#js-download-showcase').on('click', function (e) {
    console.log("downloading");
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
  });
}

//Image converter for the showcase
function convertToImage() {
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');

  canvas.width = img1.width;
  canvas.height = img1.height;

  context.globalAlpha = 1.0;
  //Draw the background image on the canvas
  context.drawImage(img1, 0, 0);

  //Draw the amiibos on the canvas
  for (let i = 0; i < showCaseArray.length; i++) {
    var img = document.getElementById("img" + (i + 2));
    context.drawImage(img, 80 + (showCaseArray[i].randomNumberX * 1040), 430 + (showCaseArray[i].randomNumberY * 120), 100 * img.width / img.height, 100);
  }
}

//for reordering the amiibo showcase so the lower height ones appear in front
function compare(a, b) {
  const numberA = a.randomNumberY;
  const numberB = b.randomNumberY;

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
  $('#showcase').empty(); //clear out the showcase for new showcase
  showCaseArray = [];
  //Make an array of selected amiibos that have random number placements.
  $('.selected').each(function (index, element) {
    showCaseArray.push({ image: $(element).children()[0].src, randomNumberY: Math.random(), randomNumberX: Math.random() });
  });

  //Sort the array so the lower height ones are on top
  showCaseArray.sort(compare);

  //This next part is sort of a failed experiment. I have hidden it because
  //I found out that it's better to have them shown in a canvas. I still do 
  //need this however because I use this to generate my canvas image
  
  //Showcase Background
  $('#showcase').append(`<img src="images/showcase.jpg" class="showcase hidden" id="img1"/>`);

  //All the selected images
  for (let i = 0; i < showCaseArray.length; i++) {
    //Assign an id to each image so it can be used in the canvas generator
    $('#showcase').append(`
    <img class="show amiiboImg hidden" src="${showCaseArray[i].image}" id="img${i + 2}" crossorigin="anonymous">`);
  }

  $('#showcase').append(`
  <p id="showcase-buttons" class="group">
    <button type="button" id="js-go-back" class="item">Go Back</button>
    <button type="button" id="js-reroll" class="item">Reroll Amiibo Placements</button>
  </p>
  <p id="download-button">
  </p>
  <canvas id="canvas" width="1280" height="720"></canvas>
  `);

  //https://stackoverflow.com/questions/11071314/javascript-execute-after-all-images-have-loaded
  //My canvas wasn't loading the first time I hit showcase so I needed this for that

  var imgs = document.images,
    len = imgs.length,
    counter = 0;

  [].forEach.call(imgs, function (img) {
    if (img.complete)
      incrementCounter();
    else
      img.addEventListener('load', incrementCounter, false);
  });
  function incrementCounter() {
    counter++;
    if (counter === len) {
      //The convertToImage is where the canvas happens
      convertToImage();
      downloadImageButton();
      showcaseButtons();
    }
  }

}

//Button functions for the main amiibos navigation page
//Basically every button has a bunch of hidden class modifiers.
function navigationButtonFunctions() {

  //Top button
  $('#js-browse-gameseries').on('click', function (e) {
    e.preventDefault();
    $('#results').addClass('hidden');
    $('#showcase').addClass('hidden');
    $('#category').removeClass('hidden');
  });

  //Top button
  $('#js-browse-all').on('click', function (e) {
    e.preventDefault();
    $('#category').addClass('hidden');
    $('#showcase').addClass('hidden');
    $('#results').removeClass('hidden');
    //This is to remove the hidden class from anything we searched through using game series
    $('button.js-amiibos').each(function () {
      $(this).removeClass('hidden');
    });
  });

  //Top button Uses everything from the browse all button but more
  $('#js-select-all').on('click', function (e) {
    e.preventDefault();
    $('#category').addClass('hidden');
    $('#showcase').addClass('hidden');
    $('#results').removeClass('hidden');

    //check to see if there are any amiibos selected
    if ($('.js-amiibos').hasClass('selected')) {
      //Confirmation to deselect the selected
      if (window.confirm("Deselect all?")) {
        $('button.js-amiibos').each(function () {
          $(this).removeClass('selected');
        });
      }
    }
    //This will select everything if none are selected
    else {
      $('button.js-amiibos').each(function () {
        $(this).addClass('selected');
      });
    }

    $('button.js-amiibos').removeClass('hidden');
  });

  //Top button
  $('#js-showcase').on('click', function (e) {
    e.preventDefault();
    $('#results').addClass('hidden');
    //Bandaid fix for spacing out amiibos
    $('#results').removeClass('results-flex');
    $('#category').addClass('hidden');
    //Bandaid fix for hiding options
    $("#options-hide").addClass("hidden");
    $('#showcase').removeClass('hidden');
    showCase();
  });

  //All the category buttons
  $('.js-gameseries-buttons').on('click', function (e) {
    e.preventDefault();
    const buttonValue = $(this).val();
    $('#category').addClass('hidden');
    $('#results').removeClass('hidden');
    //Bandaid fix for spacing out amiibos
    $('#results').addClass('results-flex');
    //Hide all the amiibos
    $('button.js-amiibos').addClass('hidden');
    //hide all the amiibos that don't have the gameseries name
    $(`button#${buttonValue}`).each(function () {
      $(this).removeClass('hidden');
    });
  });

  //All the amiibo buttons
  $('.js-amiibos').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('selected');
  });

}

//Check to see if the game series has an amiibo before putting a button down.
function checkForAmiibos(amiiboName) {
  const comparison = amiiboArray.amiibo.some(e => e.gameSeries === idCleanUp(amiiboName));
  return comparison;
}

//buttons for sorting amiibos
function displayGameSeriesButtons(responseJson) {
  //This div is to hide a flexbox which both use the display css
  $('#category').append(`<div id="category-group" class="group">`);
  //Because Super Mario is on top, we don't need to check if there are any new categories as mario will always be first
  $('#category-group').append(`<button class="js-gameseries-buttons item" value="${idCleanUp(responseJson.amiibo[0].name)}" type="button">${responseJson.amiibo[0].name}</button>`);
  
  for (let i = 1; i < responseJson.amiibo.length; i++) {
    //Filter out multiple entries from original array
    if (responseJson.amiibo[i - 1].name !== responseJson.amiibo[i].name) {
      //Make sure there are amiibos for the game series button
      if (checkForAmiibos(responseJson.amiibo[i].name)) {
        $('#category-group').append(`<button class="js-gameseries-buttons item" value="${idCleanUp(responseJson.amiibo[i].name)}" type="button">${responseJson.amiibo[i].name}</button>`);
      }
    }
  }
  //Extra category for other entries. Unused
  //$('#category-group').append(`<button class="js-gameseries-buttons item" value="Other" type="button">Other</button>`);

  $('#category').append(`</div>`);
  //The navigation buttons, game series buttons, and amiibo buttons have all loaded up to this point.
  navigationButtonFunctions();
}

//Call to API to get game series buttons. In hindsight, I don't need this as I can
//just call the first API and generate them from there.
function getGameSeries() {
  const url = searchURL + "gameseries";

  //console.log(url);
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
  //console.log(responseJson);

  $('#results').empty();

  for (let i = 0; i < responseJson.amiibo.length; i++) {
    $('#results').append(`
      <button type="button" class="js-amiibos" id="${responseJson.amiibo[i].gameSeries}">
        <img class="amiiboImg" src="${responseJson.amiibo[i].image}" alt="${responseJson.amiibo[i].name}">
      </button>`
    );
  }
  //After the amiibos are rendered, render the game series button
  getGameSeries();
}

//save the amiibo array to our const variable so we don't have to call from API again and 
//clean up array of gameSeries so they work with ids
function saveAmiiboArray(responseJson) {
  amiiboArray = responseJson;

  for (let i = 0; i < responseJson.amiibo.length; i++) {
    amiiboArray.amiibo[i].gameSeries = idCleanUp(responseJson.amiibo[i].gameSeries);
  }

  displayAmiibos(amiiboArray);
}

//Call to API to get amiibo list
function getAPI() {
  const url = searchURL + "amiibo/?type=figure";

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

//Call to first API
function renderAmiibos() {
  $('#results-screen').removeClass('hidden');
  getAPI();
}

function homePage() {
  $('#js-browse').on('click', function (e) {
    e.preventDefault();
    $('#home').addClass('hidden');
    $("html").css("background-image", "none");
    renderAmiibos();
  });
}

homePage();