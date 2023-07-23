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
  dropDown.style.display = "none";
  isOpen = false;
  cartDiv.style.display = "none";
  isCart = false;

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
    searchBox.value = "";
    isSearch = false;
  }
});

// <--------------------------------- End of search Icon functionalitites ---------------------------------->

const productName = document.querySelectorAll(".product-title");

// create a div for searched items
const searchDiv = document.createElement("div");
searchDiv.classList.add("searchDiv");
document.body.appendChild(searchDiv);

searchDiv.style.display = "none";

let searchResult = [];

searchBox.addEventListener("input", () => {
  searchDiv.style.display = "block";
  const searchText = searchBox.value.toLowerCase();

  searchDiv.innerHTML = "";

  // to check whether searched product exists
  if (searchText === "") {
    searchDiv.style.display = "none";
  } else {
    productName.forEach((product) => {
      const productNameText = product.textContent.toLowerCase();

      if (productNameText.includes(searchText)) {
        const resultItem = document.createElement("p");
        resultItem.classList.add("result-item");
        resultItem.textContent = product.textContent;
        resultItem.addEventListener("click", () => {
          // Scroll to the corresponding product when the result item is clicked
          product.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
        searchDiv.appendChild(resultItem);
      }
    });
  }
});

document.body.addEventListener("click", (e) => {
  if (!searchBox.contains(e.target)) {
    searchDiv.style.display = "none";
  }
});

// <--------------------------------- End of search list functionalitites ---------------------------------->

const cartEl = document.querySelector("#cart");

// creating cart div
const cartDiv = document.createElement("div");
cartDiv.classList.add("cartDiv");
document.body.appendChild(cartDiv);

let isCart = false;

// cart event-listener
cartEl.addEventListener("click", () => {
  if (isCart) {
    cartDiv.style.display = "none";
    isCart = false;
  } else {
    cartDiv.style.display = "flex";
    isCart = true;
  }
});

document.body.addEventListener("click", (e) => {
  if (!cartEl.contains(e.target) && !cartDiv.contains(e.target)) {
    cartDiv.style.display = "none";
    isCart = false;
  }
});

// <---------------------------------- end of cart functionalities ----------------------------------------->

const addCartBtns = document.querySelectorAll(".add-cart-btn");

let cartList = [];

let content = "";

function pushCart(productItem) {
  content += `
    <div class="productsInCart">
      <div>
        <img src="${productItem.img}" alt="" class="cart-img">
      </div>
      <div>
        <h3>${productItem.name}</h3>
        <p>Quantity : ${productItem.count}</p>
        <p>Price : ${productItem.price}</p>
      </div>
    </div>
  `;

  cartDiv.innerHTML =
    content +
    `<div class="checkout-btn">
      <button class="checkout">CHECKOUT</button>
    </div>`;
}

function addCart(e) {
  const productDiv = e.target.parentElement;
  const productImage = productDiv.querySelector("img").getAttribute("src");
  const productName = productDiv.querySelector(".product-title").textContent;
  const productPriceText =
    productDiv.querySelector(".product-price").textContent;
  const productPrice = parseInt(productPriceText.replace("₹", ""));
  const productQuantityInput = productDiv.querySelector(".quantity input");
  const productQuantity = parseInt(productQuantityInput.value);

  const productItem = {
    img: productImage,
    name: productName,
    count: productQuantity,
    price: productPrice * productQuantity,
  };

  pushCart(productItem);
}

addCartBtns.forEach((addCartBtn) => {
  addCartBtn.addEventListener("click", addCart);
});
