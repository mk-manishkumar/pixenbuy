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
    dropDown.style.position = "absolute";
    dropDown.style.top = "12vh";
    dropDown.style.left = "50vw";
    dropDown.style.background = "#333";
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

const searchBox = document.querySelector(".searchBox");

searchBox.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent click event propagation to document body

  if (searchBox.style.display === "" || searchBox.style.display === "none") {
    searchBox.style.display = "block";
    searchBox.style.position = "absolute";
    searchBox.style.top = "12vh";
  } else {
    searchBox.style.display = "none";
  }
});

document.body.addEventListener("click", () => {
  searchBox.style.display = "none";
});
