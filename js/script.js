/* 
    University of Southern Queensland
    CSC5740 Client-Side Web Technology
    Trimester 1, 2026

    Assignment 4: Project
 
    Student: Brett Jenaway
    Student No: W0104215

    Garden Indian Restaurant Website Design
*/

// Dynamic Lunch, Dinner & Takeaway Menu
// To make sections disappear and reappear
const foodMenuButtons = document.querySelectorAll(".food-menu-button");
const menuSections = document.querySelectorAll(".menu-section");

// Add event listener to each menu button
foodMenuButtons.forEach(button => {
    button.addEventListener("click", showMenu);
})

function showMenu() {
    // Get the current menu name
    const menuToShow = this.dataset.menu;

    // Add the hidden class to all menu items
    menuSections.forEach(section => {
        section.classList.add("hidden");

    })

    // Remove hidden class from menu item
    document.getElementById(menuToShow).classList.remove("hidden");

    // Remove menu button stying for all buttons
    foodMenuButtons.forEach(button => {
        button.classList.remove("active");
    });

    // Add text styling for clicked menu buton
    this.classList.add("active");
}


// Quantity selector buttons functionality
const quantitySelectors = document.querySelectorAll(".quantity");

quantitySelectors.forEach(selector => {
    const minusBtn = selector.querySelector(".minus");
    const plusBtn = selector.querySelector(".plus");
    const quantityInput = selector.querySelector(".quantity-input");

    minusBtn.addEventListener("click", () => {
        if (quantityInput.value > quantityInput.min) {
            quantityInput.value--;
            updateTotal();
        }

    })

    plusBtn.addEventListener("click", () => {
        quantityInput.value++;
        updateTotal();
    })
}
)

const takeawayItems = document.querySelectorAll(".takeaway");
const orderTotalOutput = document.querySelector("#order-total");

let orderTotal = 0;
let quantityTotal = 0;

function updateTotal() {
    orderTotal = 0;
    quantityTotal = 0;


    const orderTotalContainer = document.getElementById("order-total");
    // Clear the order summary
    orderTotalContainer.innerHTML = "";

    // Create summary headings
    const itemNameLabel = document.createElement("p");
    itemNameLabel.textContent = "Item";
    itemNameLabel.className = "orderTotalHeading orderTotalItemName";
    orderTotalContainer.appendChild(itemNameLabel);

    const itemQuantityLabel = document.createElement("p");
    itemQuantityLabel.textContent = "Quantity"
    itemQuantityLabel.className = "orderTotalHeading orderTotalItemNumber";
    orderTotalContainer.appendChild(itemQuantityLabel);

    const itemTotalLabel = document.createElement("p");
    itemTotalLabel.textContent = "Total"
    itemTotalLabel.className = "orderTotalHeading orderTotalItemNumber";
    orderTotalContainer.appendChild(itemTotalLabel);

    takeawayItems.forEach(item => {

        let itemName = item.querySelector(".dish-name").textContent.trim();
        itemName = itemName.replace(/🌶/g, "");
        let itemPrice = item.querySelector(".dish-price").textContent;
        itemPrice = Number(itemPrice.replace("$", ""));

        const quantityInput = item.querySelector(".quantity-input");
        const itemQuantity = Number(quantityInput.value);

        const itemTotal = itemQuantity * itemPrice;
        orderTotal += itemTotal;
        quantityTotal += itemQuantity;



        if (itemQuantity > 0) {
            const newItemName = document.createElement("p");
            newItemName.textContent = itemName;
            newItemName.classList.add("orderTotalItem", "orderTotalItemName");
            orderTotalContainer.appendChild(newItemName);

            const newItemQuantity = document.createElement("p");
            newItemQuantity.textContent = itemQuantity;
            newItemQuantity.classList.add("orderTotalItem", "orderTotalItemNumber");
            orderTotalContainer.appendChild(newItemQuantity);

            const newItemTotal = document.createElement("p");
            newItemTotal.textContent = "$" + itemTotal;
            newItemTotal.classList.add("orderTotalItem", "orderTotalItemNumber");
            orderTotalContainer.appendChild(newItemTotal);
        }



    })

    // Create total price at bottom headings
    const totalLabel = document.createElement("p");
    totalLabel.textContent = "Total";
    totalLabel.className = "orderTotalHeading totalItems orderTotalItemName";
    orderTotalContainer.appendChild(totalLabel);

    const totalQuantityLabel = document.createElement("p");
    totalQuantityLabel.textContent = quantityTotal;
    totalQuantityLabel.className = "orderTotalHeading orderTotalItemNumber totalItems";
    orderTotalContainer.appendChild(totalQuantityLabel);

    const orderTotalLabel = document.createElement("p");
    orderTotalLabel.textContent = "$" + orderTotal;
    orderTotalLabel.className = "orderTotalHeading orderTotalItemNumber totalItems";
    orderTotalContainer.appendChild(orderTotalLabel);
}
// Add listener to every quantity input
takeawayItems.forEach(item => {
    const quantityInput = item.querySelector(".quantity-input");
    quantityInput.addEventListener("input", updateTotal);

});


// Add event listener for Review Order button

const reviewButton = document.getElementById("review-order-button");
reviewButton.addEventListener("click", reviewOrder);

function reviewOrder() {
    // Add the hidden class to all menu items
    updateTotal();
    document.getElementById("takeaway-menu").classList.add("hidden");
    document.getElementById("orderSummary").classList.remove("hidden");
    document.getElementById("order-total").classList.remove("hidden");
    document.getElementById("customer-details").classList.remove("hidden");
}


const backButton = document.getElementById("back-button");
backButton.addEventListener("click", backForm);

function backForm() {
    // Add the hidden class to all menu items
    document.getElementById("takeaway-menu").classList.remove("hidden");
    document.getElementById("orderSummary").classList.add("hidden");
}

// Save the order to localStorage when the user clicks submit
const takeAwayForm = document.getElementById("takeaway-form");
takeAwayForm.addEventListener("submit", saveOrder);

function saveOrder(event) {

    // Validation to ensure empty orders are not submitted
    if (quantityTotal == 0) {
        event.preventDefault();
        if (!document.getElementById("errorLabel")) {
            const errorLabel = document.createElement("p");
            errorLabel.textContent = "Cannot submit an empty order. Please add more items to the order.";
            errorLabel.id = "errorLabel";
            errorLabel.classList.add("errorLabel");
            document.getElementById("submit-order").after(errorLabel);
        }
        return;
    }

    // Clear the last order from local storage
    localStorage.removeItem("latestOrder");

    // Stop the submit function page reload - the will occur with the start over button
    event.preventDefault();

    const order = {
        customerName: document.getElementById("customername").value,
        phoneNumber: document.getElementById("phone").value,
        items: []
    }

    takeawayItems.forEach(item => {

        let itemName = item.querySelector(".dish-name").textContent.trim();
        itemName = itemName.replace(/🌶/g, "");

        const quantityInput = item.querySelector(".quantity-input");
        const itemQuantity = Number(quantityInput.value);

        // Add items and quantity to storage object if quantity is greater than 0
        if (itemQuantity > 0) {
            order.items.push({ name: itemName, quantity: itemQuantity });
        }
    });

    // Save to local storage
    localStorage.setItem("latestOrder", JSON.stringify(order));

    // Hide all other parts and show confirmation
    document.getElementById("order-total").classList.add("hidden");
    document.getElementById("customer-details").classList.add("hidden");
    document.getElementById("menu-notes").classList.add("hidden");
    document.getElementById("success").classList.remove("hidden");
}

// Add functionality for new order button
const startOver = document.getElementById("start-over");
startOver.addEventListener("click", startOrderAgain);

function startOrderAgain() {
    location.reload()
}


// Load the previous order when the user clicks Load Previous Order
const previousOrder = document.getElementById("load-previous-order-button");
previousOrder.addEventListener("click", loadPreviousOrder);

function loadPreviousOrder() {
    const lastOrder = localStorage.getItem("latestOrder");

    // Check if the last order is empty/if there is no previous order
    if (lastOrder === null) {
        return;
    }

    const order = JSON.parse(lastOrder);

    // Load previous customer name and phone number
    document.getElementById("customername").value = order.customerName;
    document.getElementById("phone").value = order.phoneNumber;

    // Loop each item and match the item name. When found add the previous quantity number.
    takeawayItems.forEach(item => {
        item.querySelector(".quantity-input").value = 0;

        let itemName = item.querySelector(".dish-name").textContent.trim();
        itemName = itemName.replace(/🌶/g, "").trim();

        order.items.forEach(savedItem => {
            if (savedItem.name === itemName) {
                item.querySelector(".quantity-input").value = savedItem.quantity;
            }
        })
    });

    // Update the total with the previous order
    updateTotal();
}


// Clear all button
const clearOrderButton = document.getElementById("clear-order-button");

clearOrderButton.addEventListener("click", clearOrder);

function clearOrder() {

    takeawayItems.forEach(item => {

        const quantityInput = item.querySelector(".quantity-input");

        quantityInput.value = 0;

    });

    updateTotal();

}
