'use strict';

let entrees = [], desserts = [], beverages = [];

// Attach event listeners to each .menu-item
document.querySelectorAll('.menu-item').forEach((item) => {
  item.addEventListener('click', handleItemClick);
  //item.querySelector('.qty-input').addEventListener('input', updateSelectedItems);
  item.querySelector('.cancel-x').addEventListener('click', cancelSelectedItem);
  item.querySelector(".check-it").addEventListener('click', handleClickCheck)
});
  
function handleItemClick(event) {
  const item = event.currentTarget;
  const qtyInput = item.querySelector('.qty-input');
  const cancelX = item.querySelector('.cancel-x');
  const checkIt = item.querySelector('.check-it');

  qtyInput.style.display = 'block';
  cancelX.style.display = 'block';
  checkIt.style.display = 'block';
  qtyInput.focus();
}

function handleClickCheck(event) {
  event.stopPropagation();
  const item = event.target.closest('.menu-item');
  console.log(`Confirmed: ${item.dataset.name}`);
  updateSelectedItems(event);
  updateCurrentSubtotal();
}

function cancelSelectedItem(event) {
  event.stopPropagation();  // prevent re-activating the item
    
  const item = event.target.closest('.menu-item');
  const name = item.dataset.name;
  const category = item.dataset.category;

  item.querySelector('.qty-input').style.display = 'none';
  item.querySelector('.cancel-x').style.display = 'none';
  item.querySelector('.check-it').style.display = 'none';
  item.querySelector('.qty-input').value = '';
  
  // remove from array and update sidebar...
  removeSelectedItem(item);
  updateCurrentSubtotal();
}


// Handles quantity input changes
function updateSelectedItems(event) {
  const item = event.target.closest('.menu-item');
  const qtyInput = item.querySelector(".qty-input"); // the number input box that was changed
  
  // Use closest() to safely find the menu-item container even if structure changes
  const name = item.dataset.name;
  const category = item.dataset.category;
  const qty = qtyInput.value;
  
  // Log the updated quantity for that specific item
  console.log(`Updated quantity: ${name} × ${qty}`);
  if (qty > 0) {
    let itemObject = {name: name, amount: qty };
    let targetArray;
    if (category === "entree") {
      targetArray = entrees;
    } else if (category === "dessert") {
      targetArray = desserts;
    } else {
      targetArray = beverages;
    }

    const index = targetArray.findIndex(i => i.name === name);

    if (index !== -1) 
    {
      targetArray[index].amount = qty;
    } 
    else 
    {
      targetArray.push(itemObject);
    }
    updateLiveOrder();
  }
  else {
    removeSelectedItem(item);
  }
}
  
function removeSelectedItem(item) {
  const name = item.dataset.name;
  const category = item.dataset.category;
  let targetArray;
  if (category === "entree") {
    targetArray = entrees;
  } else if (category === "dessert") {
    targetArray = desserts;
  } else {
    targetArray = beverages;
  }
  const index = targetArray.findIndex(i => i.name === name);
  if(index != -1)
  {
    targetArray.splice(index, 1);
  }
  updateLiveOrder();
}  

function updateLiveOrder()
{
  let entreeSb = document.getElementById('entree-list');
  let beverageSb = document.getElementById('beverage-list');
  let dessertSb = document.getElementById('dessert-list');
  // clear all children
  entreeSb.replaceChildren();
  // add each item in entrees as a li
  entrees.forEach((item) => {
    let newElem = document.createElement('li');
    let textNode = document.createTextNode(`${item.name} × ${item.amount}`);
    newElem.appendChild(textNode);
    entreeSb.appendChild(newElem);
  });
  // clear all children
  beverageSb.replaceChildren();
  // add each item in entrees as a li
  beverages.forEach((item) => {
    let newElem = document.createElement('li');
    let textNode = document.createTextNode(`${item.name} × ${item.amount}`);
    newElem.appendChild(textNode);
    beverageSb.appendChild(newElem);
  });
  // clear all children
  dessertSb.replaceChildren();
  // add each item in entrees as a li
  desserts.forEach((item) => {
    let newElem = document.createElement('li');
    let textNode = document.createTextNode(`${item.name} × ${item.amount}`);
    newElem.appendChild(textNode);
    dessertSb.appendChild(newElem);
  });
}

document.getElementById("orderForm").addEventListener('submit', function (event) {
  serializeOrder(); // ensure orderJSON gets updated before submission
});

function getSelectedAddOns()
{
  return Array.from(document.querySelectorAll('input[name="addons[]"]:checked')).map(checkbox => checkbox.value);
}

function getTodayDateString() {
  const td= new Date();
  const year = td.getFullYear();
  const month = String(td.getMonth() + 1).padStart(2, '0');
  const day = String(td.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function serializeOrder() {
  const order = {
    customer: document.getElementById("name").value,
    date: getTodayDateString(), // or inline code for today's date
    delivery: document.getElementById("delivery").checked,
    tipPercent: parseFloat(document.querySelector('input[name="tip"]:checked')?.value || 0),
    entrees: entrees,
    beverages: beverages,
    desserts: desserts,
    addOns: getSelectedAddOns()
  };

  const orderJSONString = JSON.stringify(order);
  document.getElementById('orderJSON').value = orderJSONString;

  const orderJSONStringPrint = JSON.stringify(order, null, 2);
  console.log(orderJSONStringPrint);
}

document.getElementById("previewBtn").addEventListener("click", function () {
  processOrder();
});

function updateCurrentSubtotal() {
  let subSpan = document.getElementById("subtotal-span");
  let subtotal = 0;
  entrees.forEach(item => {
    subtotal += priceMap[item.name] * item.amount;
  });
  beverages.forEach(item => {
    subtotal += priceMap[item.name] * item.amount;
  });
  desserts.forEach(item => {
    subtotal += priceMap[item.name] * item.amount;
  });
  subSpan.textContent = `${subtotal.toFixed(2)}`;
}
