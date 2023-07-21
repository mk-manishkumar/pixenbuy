document.querySelector(".head").addEventListener("click", () => {
  location.reload();
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
});

// <---------------------------------------- end of logo ------------------------------------------------->

const categories = document.querySelector(".categories");
const dropDown = document.querySelector(".dropdown-menu");
const dropDownItems = document.querySelectorAll(".dropdown-menu a");

let isOpen = false;

categories.addEventListener("click", () => {
  if (isOpen) {
    dropDown.style.display = "none";
    isOpen = false;
  } else {
    dropDown.style.display = "block";
    isOpen = true;
  }
});

dropDownItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    dropDown.style.display = "none";
    isOpen = false;
  });
});

document.body.addEventListener("click", (event) => {
  if (!categories.contains(event.target) && !dropDown.contains(event.target)) {
    dropDown.style.display = "none";
    isOpen = false;
  }
});

// <-------------------------------------- End of Dropdown functionalities -------------------------------------->

const searchBox = document.createElement("input");
searchBox.classList.add("searchBox");
searchBox.placeholder = "Search your items...";

const searchItems = document.getElementById("searchItems");
let isSearch = false;

searchItems.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent click event propagation to document body

  if (isSearch) {
    searchBox.style.display = "none";
    isSearch = false;
  } else {
    searchBox.style.display = "block";
    searchBox.focus();

    isSearch = true;
  }
});

document.body.appendChild(searchBox);

document.body.addEventListener("click", (e) => {
  if (!searchBox.contains(e.target)) {
    searchBox.style.display = "none";
    isSearch = false;
  }
});

// <--------------------------------- End of search Icon functionalitites ---------------------------------->

const productName = document.querySelectorAll(".product-title");

searchBox.addEventListener("input", () => {
  const searchText = searchBox.value.toLowerCase();
  
  // create a div for searched items
  const searchDiv = document.createElement("div");
  searchDiv.classList.add("searchDiv");

  // to check whether searched product exists
  productName.forEach((product) => {
    const productNameText = product.textContent.toLowerCase();

    if (productNameText.includes(searchText)) {
    }
  });
});
