
const apiKey = 'AIzaSyDWsgKmPfAM_WGxw4OTlzG0oRL4mVU8nCg';
const featuredApiUrl = `https://www.googleapis.com/books/v1/volumes?q=Bhagvat Gita&maxResults=3&key=${apiKey}`;
const newApiUrl = `https://www.googleapis.com/books/v1/volumes?q=uglylove&maxResults=3&key=${apiKey}`;
const oldApiUrl = `https://www.googleapis.com/books/v1/volumes?q=thesubtleart&maxResults=3&key=${apiKey}`;
 
async function fetchFeaturedBooks() {
  
    try {
      const response = await fetch(featuredApiUrl);
      const data = await response.json();
      
      const featuredBooksContainer = document.getElementById('featured-books');
      
      data.items.forEach(book => {
        const bookCard = createBookCard(book.volumeInfo);
        featuredBooksContainer.appendChild(bookCard);
      });
    } catch (error) {
      console.log('Sorry Books not available!', error);
    }
  }
  
  function createBookCard(bookData) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
  
    const bookImage = document.createElement('img');
    bookImage.src = bookData.imageLinks ? bookData.imageLinks.thumbnail : 'no-image.png';
    bookImage.alt = bookData.title;
  
    const bookTitle = document.createElement('h3');
    bookTitle.textContent = bookData.title;
  
    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = 'Author: ' + (bookData.authors ? bookData.authors.join(', ') : 'Unknown');

    const orderButton = document.createElement('button');
    orderButton.textContent = 'Order';
    orderButton.addEventListener('click', () => showOrderForm(bookData.title));
  
    bookCard.appendChild(bookImage);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(orderButton);
  
    return bookCard;
  }
  
  window.addEventListener('load', fetchFeaturedBooks);
  window.addEventListener('load', () => {
    fetchNewBooks();
    fetchOldBooks();
  });
  
async function fetchNewBooks() {

  try {
    const response = await fetch(newApiUrl);
    const data = await response.json();

    const newBooksContainer = document.getElementById('new-books');

    data.items.forEach(book => {
      const bookListing = createBookListing(book.volumeInfo);
      newBooksContainer.appendChild(bookListing);
    });
  } catch (error) {
    console.log('Error fetching new books:', error);
  }
}

async function fetchOldBooks() {

  try {
    const response = await fetch(oldApiUrl);
    const data = await response.json();

    const oldBooksContainer = document.getElementById('old-books');

    data.items.forEach(book => {
      const bookListing = createBookListing(book.volumeInfo);
      oldBooksContainer.appendChild(bookListing);
    });
  } catch (error) {
    console.log('Error fetching old books:', error);
  }
}

function closeOrderForm() {
  const orderFormContainer = document.querySelector('.order-form-container');
  if (orderFormContainer) {
    document.body.removeChild(orderFormContainer);
  }
}

function createBookListing(bookData) {
  const bookListing = document.createElement('div');
  bookListing.className = 'book-listing';

  const bookImage = document.createElement('img');
  bookImage.src = bookData.imageLinks ? bookData.imageLinks.thumbnail : 'no-image.png';
  bookImage.alt = bookData.title;

  const bookTitle = document.createElement('h3');
  bookTitle.textContent = bookData.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.textContent = 'Author: ' + (bookData.authors ? bookData.authors.join(', ') : 'Unknown');

  const orderButton = document.createElement('button');
  orderButton.textContent = 'Order';
  orderButton.addEventListener('click', () => showOrderForm(bookData.title));

  bookListing.appendChild(bookImage);
  bookListing.appendChild(bookTitle);
  bookListing.appendChild(bookAuthor);
  bookListing.appendChild(orderButton);
  return bookListing;
}

function displaySearchResults(query) {
  const searchResultsContainer = document.querySelector('#search-results');
  searchResultsContainer.innerHTML = '';

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=6&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        data.items.forEach(book => {
          const bookCard = createSearchBookCard(book);
          searchResultsContainer.appendChild(bookCard);
        });
      } else {
        searchResultsContainer.innerHTML = '<p>No results found</p>';
      }
    })
    .catch(error => {
      console.log('An error occurred:', error);
      searchResultsContainer.innerHTML = '<p>Sorry Books not available!</p>';
    });
}

function createSearchBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.classList.add('book-card');

  const bookImage = document.createElement('img');
  bookImage.src = book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg';
  bookImage.alt = book.volumeInfo.title;
  bookCard.appendChild(bookImage);

  const bookTitle = document.createElement('h3');
  bookTitle.textContent = book.volumeInfo.title;
  bookCard.appendChild(bookTitle);

  const bookAuthor = document.createElement('p');
  bookAuthor.textContent = book.volumeInfo.authors?.join(', ');
  bookCard.appendChild(bookAuthor);

  const orderButton = document.createElement('button');
    orderButton.textContent = 'Order';
    bookCard.appendChild(orderButton);
    orderButton.addEventListener('click', () => showOrderForm(book.volumeInfo.title));

  return bookCard;
}

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  const searchInput = document.querySelector('#search-input');
  const searchQuery = searchInput.value;
  displaySearchResults(searchQuery);
});

function showOrderForm(bookTitle) {
  const orderFormContainer = document.createElement('div');
  orderFormContainer.className = 'order-form-container';

  const orderForm = document.createElement('form');
  orderForm.className = 'order-form';
  orderForm.action = "https://formspree.io/f/mqkovvbg"; 
  orderForm.method = 'POST';

  const cancelIcon = document.createElement('i');
  cancelIcon.className = 'fas fa-times cancel-icon';
  cancelIcon.addEventListener('click', closeOrderForm);

  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name:';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'Name';

  const phoneLabel = document.createElement('label');
  phoneLabel.textContent = 'Phone Number:';
  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.name = 'Phone number';
  phoneInput.pattern = '[0-9]{10}';
  phoneInput.placeholder = 'Enter 10-digit phone number';

  const bookName =  document.createElement('input');
  bookName.type = 'hidden';
  bookName.name = 'Book Name';
  bookName.value = bookTitle;


  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.type = 'submit';

  orderForm.appendChild(cancelIcon);
  orderForm.appendChild(nameLabel);
  orderForm.appendChild(nameInput);
  orderForm.appendChild(phoneLabel);
  orderForm.appendChild(phoneInput);
  orderForm.appendChild(bookName);
  orderForm.appendChild(submitButton);

  orderFormContainer.appendChild(orderForm);
  document.body.appendChild(orderFormContainer);
}

function displayBooksOnPageLoad() {
  const searchResultsContainer = document.querySelector('#search-results');
  searchResultsContainer.innerHTML = '<p>Loading books...</p>';

  fetch(`https://www.googleapis.com/books/v1/volumes?q=markmanson&maxResults=3&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        searchResultsContainer.innerHTML = ''; 

        data.items.forEach(book => {
          const bookCard = createSearchBookCard(book);
          searchResultsContainer.appendChild(bookCard);
        });
      } else {
        searchResultsContainer.innerHTML = '<p>No books found</p>';
      }
    })
    .catch(error => {
      console.log('An error occurred:', error);
      searchResultsContainer.innerHTML = '<p>Sorry Books not available!</p>';
    });
}

displayBooksOnPageLoad();