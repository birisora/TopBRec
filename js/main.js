'use strict';

const nytimesKey = config.NYT_KEY;
// const googleBooksKey = config.GOOGLE_BOOKS_KEY;
const tastediveKey = config.TASTEDIVE_KEY;
const NYT_BOOKS_ENDPOINT = 'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json';
const GOOGLE_BOOKS_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes';
const TASTEDIVE_BOOKS_ENDPOINT = 'https://tastedive.com/api/similar';
const API_DATA = {
  tastedive: null,
  googlebook: null,
  googlebookData: {}
};
// testing
let count = 0;

// Starting off by initializing page with some of the popular fictions
function initPage () {
  fetch(`${NYT_BOOKS_ENDPOINT}?&api-key=${nytimesKey}`, {
    method: 'get'
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      updateBestSellers(json);
      // console.log(json);
    })
    .catch((error) => {
      // in the case of hitting the rate limit... we'll use an archive
      // 1000 calls allowed only
      // console.log(`NYT API Error: Search not found: ${error}`);
      updateBestSellers(nytimesArchive);
    });
}

// This handles the user search form and after user types in their input
function handleForm () {
  const bookSearchForm = $('form[name=book-search');
  const searchInput = $('input[name=user-input');
  let option = $('#searchField').find('option:selected').val();
  // console.log(option);
  $('#searchField').change(function () {
    option = $(this).find('option:selected').val();
    // console.log(option);
  });

  bookSearchForm.on('submit', (e) => {
    e.preventDefault();
    // get user values inputted
    let userSearch = searchInput.val();
    userSearch = userSearch.replace(/\s+/g, '+').toLowerCase();
    // reset the input
    resetSearchFields(searchInput);

    // fetch data based on user input using google api and tastedive
    // fetchBookData(option, userSearch);
    googleAjax(option, userSearch);
  });
}

// updates the book listing on home page using nytimes
function updateBestSellers (nytimesBestSellers) {
  nytimesBestSellers.results.books.forEach(function bestSellerBook (book) {
    // for testing
    count = 0;
    const lastWeekRank = book.rank_last_week || 'n/a';
    const weeksOnList = book.weeks_on_list || 'New this week!';
    const listing = `
      <div id="${book.rank}" class="entry">
        <p>
          <img src="${book.book_image}" class="book-cover" id="cover-${book.rank}" alt="book: ${book.title}">
        </p>
        <h2>
          <a href="${book.amazon_product_url}" target="_blank">${book.title}</a>
        </h2>
        <h4>By ${book.author}</h4>
        <h4 class="publisher">Published by: ${book.publisher}</h4>
        <p>${book.description}</p>
        <div class="stats">
          <p>Last Week: ${lastWeekRank}</p>
          <p>Weeks on list: ${weeksOnList}</p>
        </div>
      </div>`;

    $('#best-seller-titles').append(listing);
    $(`#${book.rank}`).attr('nyt-rank', book.rank);

    // updateCover(book.rank, isbn);
  });
}

function googleAjax (option, searchTerm) {
  // we need to grab book data
  // might not need success
  const settings = {
    url: GOOGLE_BOOKS_ENDPOINT,
    data: {
      q: `${option}:${searchTerm}`
    },
    dataType: 'json',
    type: 'GET',
    success: function (data) {
      API_DATA.googlebook = data;
      // console.log('from google ajax');
      // console.log(data.items);
    }
  };
  $.ajax(settings)
    .then(() => {
      getGoogleBookData(API_DATA.googlebook);
      // console.log('ajax googlebook list');
      // console.log(API_DATA.googlebook);
      tastediveAjax(API_DATA.googlebookData.title);
    })
    .catch((error) => {
      // console.log(error);
      showErr();
    });
}

function showErr () {
  $('#best-seller-titles').empty();
  $('#best-seller-titles').append(`<p>Content not found. Did you mean to search by isbn?</p>`);
}

function tastediveAjax (searchTerm) {
  // console.log(`testing to see if spaces in searchTerm messes things up ${searchTerm}`);
  // for mulitple words, the spaces needs to turn into +
  // const tasteSearchterm = searchTerm.replace(/\s+/g, '+').toLowerCase();
  // const tasteSearch = toTitleCase(searchTerm);

  // Need to figure out how to get around CORS for tastedive
  const dataTastedive = {
    k: tastediveKey,
    q: searchTerm,
    type: 'books',
    limit: 5,
    info: 1
  };

  // Loading spinner here

  // ajax call
  // adding in jsonp helped resolve No 'Access-Control-Allow-Origin'
  $.ajax({
    type: 'GET',
    url: TASTEDIVE_BOOKS_ENDPOINT,
    jsonp: 'callback',
    dataType: 'jsonp',
    data: dataTastedive,
    success: function (data) {
      API_DATA.tastedive = data;
      // console.log('ajax of TD');
      // console.log(API_DATA.tastedive);
    }
  }).then(() => {
    updateSearchItems(API_DATA.tastedive);
  });
}

// Here we'll grab google book data to return relevant information for tastedive to use
function getGoogleBookData (data) {
  // console.log('inside getgooglebookdata');
  // console.log(data);
  API_DATA.googlebookData.title = data.items[0].volumeInfo.title;
  API_DATA.googlebookData.thumbnail = data.items[0].volumeInfo.imageLinks.thumbnail;
  API_DATA.googlebookData.previewLink = data.items[0].volumeInfo.previewLink;
  // console.log('google book data');
  // console.log(API_DATA.googlebookData);
}

function updateSearchItems (tastedive) {
  const tastediveSimilar = tastedive.Similar.Info[0];
  // otherBooks(tastediveSimilar);
  const arr = [tastediveSimilar, ...tastedive.Similar.Results];
  // console.log(arr);
  const promises = arr.map(otherBooks);
  // console.log('something', promises);
  Promise.all(promises)
    .then (books => {
      $('#best-seller-titles').html(books.map(book => { 
        console.log('book', book);
        return `
        <p>title: ${book.Name}</p>
        <p>
          <img src="${book.items[0].volumeInfo.imageLinks.thumbnail}" alt="book: ${book.Name}">
        </p>
        <p>description: ${book.wTeaser}</p>
        <p><a href="${book.wUrl}" target="_blank">Wikipedia Link</a></p>
      `
      }))
    });
}

function otherBooks (searchItem) {
  return fetch(`${GOOGLE_BOOKS_ENDPOINT}?q=intitle:${searchItem.Name}`)
    .then((response) => {
      console.log('response from otherBooks!');
      return response.json();
    })
    .then((data) => Object.assign(data, searchItem))
    .catch((error) => {
      console.log(error);
      // console.log('Google API Error');
    });
}

// reset search field
function resetSearchFields (userSearch) {
  userSearch.val('');
  $('#best-seller-titles').empty();
}

// When user clicks logo, bring back the home page
function handleLogoPressed () {
  $('header').on('click', '#nyt-logo', (event) => {
    $('#best-seller-titles').empty();
    initPage();
  });
}

$(() => {
  initPage();
  handleForm();
  handleLogoPressed();
});
