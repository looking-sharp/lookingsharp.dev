/*
  Name: Thomas Sharp
  Date: 5/6/2025
  Class: CS 290 – Web Development

  Instructions:
  - Add your name, date, and class above.
  - Provide a detailed comment header before each function describing what it does.
  - Leave all TODO comments in place while working. Remove them only after completing each function.
  - Use clear variable names and add inline comments to explain your logic.
*/
'use strict';

const priceMap = {
  // Entrées
  "Fish and Chips": 12.50,
  "Fish and no Chips": 10.50,
  "Fish and Fish": 21.00,
  "Fish and Fish and Fish": 31.50,
  "Fish and Clips": 30.00,
  "Fish and Tips": 40.00,
  "Chips": 3.00,
  "Chips and Chips": 6.00,

  // Beverages
  "Coke": 2.50,
  "Pepsi": 2.50,
  "Dr Pepper": 2.50,
  "Dr Shasta": 2.50,
  "Root Beer": 2.50,
  "Pickle Water": 2.50,
  "Diet Pickle Water": 2.50,
  "Fish Head Cocktail": 7.50,
  "Surströmming Shake": 3.00,

  // Desserts
  "Bean Cake": 5.00,
  "Sausage Cake": 12.00,
  "Fish and Chips Cake": 10.00,
  "Fish Ice Cream": 3.00
};

function processOrder() {
  // Serialize order and do json parse
  serializeOrder();
  const jsonOrder = JSON.parse(document.getElementById("orderJSON").value);
  const reciept = getReceipt(jsonOrder, priceMap);
  console.log(reciept);

  let recieptOutput = document.getElementById("receiptOutput");
  recieptOutput.replaceChildren();

  let pre = document.createElement('pre');
  let textNode = document.createTextNode(`${reciept}`);

  pre.appendChild(textNode);
  recieptOutput.appendChild(pre);
}

function validateOrder(order) {
  return (order.customer !== null) && (Array.isArray(order.entrees)) && (Array.isArray(order.drink) || Array.isArray(order.dessert));
}


function calculateSubtotal(order, prices) {
  let subtotal = 0;
  order.entrees.forEach(item => {
    subtotal += prices[item.name] * item.amount;
  });
  order.beverages.forEach(item => {
    subtotal += prices[item.name] * item.amount;
  });
  order.desserts.forEach(item => {
    subtotal += prices[item.name] * item.amount;
  });
  return subtotal;
}

function calculateTip(subtotal, percent) {
   return (subtotal * (percent / 100)).toFixed(2);
}

function getReceipt(order, prices) {
  let output = "";
  output += "Big Fish Bistro Reciept – " + order.customer + "\n";
  output += "Date: " + order.date + "\n";
  output += "----------------------------------------\n";

  if (Array.isArray(order.entrees)) {
    order.entrees.forEach(function(item) {
      const cost = prices[item.name] * item.amount;
      output += "Entrée: " + item.name + " x " + item.amount + " – $" + cost.toFixed(2) + "\n";
    });
  }
  if (Array.isArray(order.beverages)) {
    order.beverages.forEach(function(item) {
      const cost = prices[item.name] * item.amount;
      output += "Drink: " + item.name + " x " + item.amount + " – $" + cost.toFixed(2) + "\n";
    });
  }
  if (Array.isArray(order.desserts)) {
    order.desserts.forEach(function(item) {
      const cost = prices[item.name] * item.amount;
      output += "Dessert: " + item.name + " x " + item.amount + " – $" + cost.toFixed(2) + "\n";
    });
  }
  let subtotal = calculateSubtotal(order, prices);
  let tip = Number(calculateTip(subtotal, order.tipPercent));
  let delivery = order.delivery ? 3.00 : 0;
  let total = Number(subtotal) + Number(tip) + Number(delivery);
  output += "Subtotal: $" + subtotal.toFixed(2) + "\n";
  output += "Tip: $" + tip.toFixed(2) + "\n";
  output += "Delivery: $" + delivery.toFixed(2) + "\n";
  output += "----------------------------------------\n";
  output += "Total: $" + total.toFixed(2) + "\n";

  return output;
}