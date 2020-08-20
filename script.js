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
  $('#js-select-all').on('click',function(e) {
    e.preventDefault();
    $('#category').addClass('hidden');
    $('#showcase').addClass('hidden');
    $('#results').removeClass('hidden');
    $('#results').addClass('results-flex');

    if($('.js-amiibos').hasClass('selected')) {
      if (window.confirm("Deselect all?")) {
        $('button.js-amiibos').each(function() {
        $(this).removeClass('selected');
        });
      }
    }
    else {
      $('button.js-amiibos').each(function() {
        $(this).addClass('selected');
      });
    }
    
    $('button.js-amiibos').each(function() {
      $(this).removeClass('hidden');
    });
  });

  //Top button
  $('#js-showcase').on('click',function(e) {
    e.preventDefault();
    $('#results').addClass('hidden');
    $('#results').removeClass('results-flex');
    $('#category').addClass('hidden');
    $('#options').addClass('hidden'); //why doesn't options work here? I had to make another container to get options to disappear.
    $("#options-hide").addClass("hidden"); //dummy class cause idk how
    $('#showcase').removeClass('hidden');
    showCase();
  });

  //All the category buttons
  $('.js-gameseries-buttons').on('click',function(e) {
    e.preventDefault();
    const buttonValue = $(this).val();
    $('#category').addClass('hidden');
    $('#results').removeClass('hidden');
    $('#results').addClass('results-flex');
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

//Buttons for the showcase screen
function showcaseButtons() {
  $('#js-go-back').on('click',function() {
    $('#options').removeClass('hidden');
    $('#showcase').addClass('hidden');
    $('#results').removeClass('hidden');
    $('#results').addClass('results-flex');
    $("#options-hide").removeClass("hidden");
  });

  $('#js-reroll').on('click',function() {
    showCase();
  });
}

function downloadImageButton() {
  $('#js-download-showcase').remove();
  $('#download-button').append(`<a href="#" class="button" id="js-download-showcase" download="Amiibo_ShowCase"><img id="download" src="images/download.png" alt="Download"></a>`);

  var button = document.getElementById('js-download-showcase');

  $('#js-download-showcase').on('click',function(e) {
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
  context.drawImage(img1, 0, 0);

  for(let i=0; i<showCaseArray.length;i++) {
    var img = document.getElementById("img" + (i+2));
    context.drawImage(img, 80+(showCaseArray[i].randomNumberX*1040), 430+(showCaseArray[i].randomNumberY*120), 100 * img.width / img.height, 100);
  }
}

//for reordering the amiibo showcase so the right ones appear in front
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
  //I wanted to find the src from the img of the child of this but I couldn't figure out how
  $('#showcase').empty();
  showCaseArray = [];
  $('.selected').each(function(index, element) {
    showCaseArray.push({image: $(element).children()[0].src, randomNumberY: Math.random(), randomNumberX: Math.random()});
  });

  showCaseArray.sort(compare);
  
  $('#showcase').append(`<img src="images/showcase.jpg" class="showcase hidden" id="img1"/>`);

  for(let i=0;i<showCaseArray.length;i++) {
    $('#showcase').append(`
  <img class="show amiiboImg hidden" src="${showCaseArray[i].image}" id="img${i+2}" crossorigin="anonymous">
  `);

  $(`img#img${i+2}`).css({'top': 530+(showCaseArray[i].randomNumberY*120), 'left': 80+(showCaseArray[i].randomNumberX*1040)});
  }

  $('#showcase').append(`
  <p id="showcase-buttons" class="group">
    <button type="button" id="js-go-back" class="item">Go Back</button>
    <button type="button" id="js-reroll" class="item">Reroll Amiibo Placements</button>
  </p>
  <p id="download-button">
  </p>
  <canvas id="canvas"></canvas>
  `);
  
  //Copied this from https://stackoverflow.com/questions/11071314/javascript-execute-after-all-images-have-loaded to make my canvas load properly
  var imgs = document.images,
  len = imgs.length,
  counter = 0;

  [].forEach.call( imgs, function( img ) {
    if(img.complete)
      incrementCounter();
    else
      img.addEventListener( 'load', incrementCounter, false );
} );
  function incrementCounter() {
    counter++;
    if ( counter === len ) {
      downloadImageButton();
      convertToImage();
      showcaseButtons();
    }
}

}

//Check to see if the game series has an amiibo before putting a button down.
function checkForAmiibos(amiiboName) {
  const comparison = amiiboArray.amiibo.some(e => e.gameSeries === idCleanUp(amiiboName));
  return comparison;
}

//buttons for sorting amiibos
function displayGameSeriesButtons(responseJson) {
  //console.log(responseJson);

  $('#category').empty();
  $('#category').append(`<div id="category-group" class="group">`);
  if(checkForAmiibos(responseJson.amiibo[0].name)) {
    $('#category-group').append(`<button class="js-gameseries-buttons item" value="${idCleanUp(responseJson.amiibo[0].name)}" type="button" ">${responseJson.amiibo[0].name}</button>`);
  }
  for(let i=1; i<responseJson.amiibo.length;i++) {
    //Filter out multiple entries from original array
    if(responseJson.amiibo[i-1].name !== responseJson.amiibo[i].name) {
      //Make sure there are amiibos for the game series button
      if(checkForAmiibos(responseJson.amiibo[i].name)) {
        $('#category-group').append(`<button class="js-gameseries-buttons item" value="${idCleanUp(responseJson.amiibo[i].name)}" type="button">${responseJson.amiibo[i].name}</button>`);
      }
    }
  }
  //Extra category for other entries.
  //$('#category-group').append(`<button class="js-gameseries-buttons item" value="Other" type="button">Other</button>`);

  $('#category').append(`</div>`);
  //The navigation buttons, game series buttons, and amiibo buttons have all loaded up to this point.
  navigationButtonFunctions();
}

//Call to API to get game series buttons
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

  for(let i=0; i<responseJson.amiibo.length;i++) {
    $('#results').append(`
      <button type="button" class="js-amiibos" id="${responseJson.amiibo[i].gameSeries}">
        <img class="amiiboImg" src="${responseJson.amiibo[i].image}" alt="${responseJson.amiibo[i].name}">
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

  //console.log(url);
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
    $("html").css("background-image", "none");
    renderAmiibos();
  });
}

homePage();