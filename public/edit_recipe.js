
window.addEventListener('DOMContentLoaded', (event) => {
    // const doc = button.dataset.doc;
    document.getElementById('recipeName').value = document.getElementById('recipeName').dataset.doc;
    document.getElementById('instructions').value = document.getElementById('instructions').dataset.doc;
    document.getElementById('prepTime').value = document.getElementById('prepTime').dataset.doc;
    document.getElementById('dishes').value = document.getElementById('dishes').dataset.doc;
});

window.addEventListener('DOMContentLoaded', (event) => {
    var groceryList = document.getElementById('groceryList');

    groceryList.addEventListener('click', function (event) {
        var target = event.target;
        if (target.classList.contains('lni-trash')) {
            var listItem = target.parentNode;
            listItem.parentNode.removeChild(listItem);
        }
    });
});

function addIngredient() {
    var ingredientInput = document.getElementById("ingredientInput");
    var groceryList = document.getElementById("groceryList");

    // Get the value from the input field
    var ingredientValue = ingredientInput.value.trim(); // Remove leading/trailing whitespace

    // Check if the ingredient value is empty
    if (ingredientValue === "") {
        // Input is empty, do not proceed
        return;
    }

    // Create a new list item
    var li = document.createElement("li");
    li.textContent = ingredientValue;

    // Append the list item to the grocery list
    groceryList.appendChild(li);

    // Clear the input field
    ingredientInput.value = "";
}
function getIngredients() {
    var groceryList = document.getElementById('groceryList');
    var ingredients = [];

    for (var i = 0; i < groceryList.children.length; i++) {
        var listItem = groceryList.children[i];
        ingredients.push(listItem.textContent);
    }

    return ingredients;
}
const saveButton = document.querySelector('button.save');
saveButton.addEventListener('click', (e) => {
    const category = document.getElementById('category').value;
    const recipeName = document.getElementById('recipeName').value.trim();
    const ingridients = getIngredients();
    const instructions = document.getElementById('instructions').value.trim();
    const prepTime = document.getElementById('prepTime').value.trim();
    const dishes = document.getElementById('dishes').value.trim();
    const postId = saveButton.dataset.doc;
    console.log(category);
    if (recipeName.length < 3 || recipeName.length > 50) {
        showError('Recipe name must be between 5 and 50 characters long.');
        return;
    }

    if (recipeName === '') {
        showError('Please enter a recipe name.');
        return;
    }

    if (instructions === '') {
        showError('Please enter instructions.');
        return;
    }

    if (prepTime === '') {
        showError('Please enter the preparation time.');
        return;
    }

    if (dishes === '') {
        showError('Please enter the number of dishes.');
        return;
    }
    if (!isPositiveInteger(prepTime)) {
        showError('Preparation time must be a positive integer.');
        return;
    }

    // Validate number of dishes
    if (!isPositiveInteger(dishes)) {
        showError('Number of dishes must be a positive integer.');
        return;
    }
    // Validate preparation time
    // if (!(isPositiveInteger(prepTime))) {
    //     showError('Preparation time must be a positive integer.');
    //     return;
    // }

    // // Validate number of dishes
    // if (!(isPositiveInteger(dishes))) {
    //     showError('Number of dishes must be a positive integer.');
    //     return;
    // }
    // Create a new FormData object
    // const data = {
    //     category: category,
    //     name: recipeName,
    //     instructions: instructions,
    //     preparationTime: prepTime,
    //     dishes: dishes,
    // };
    // var formData = new FormData();
    // formData.append('category', category);
    // formData.append('name', recipeName);
    // formData.append('instructions', instructions);
    // formData.append('preparationTime', prepTime);
    // formData.append('dishes', dishes);
    // formData.append('image', image); // Append the image file to the FormData object
    // formData.append('ingredients', JSON.stringify(ingredients));
    fetch('/editRecipe', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

            category: category,
            name: recipeName,
            ingridients: ingridients,
            instructions: instructions,
            preparationTime: prepTime,
            dishes: dishes,
            postId: postId,
        })
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server if needed
            console.log(data);
            showMessage();
            location.reload();
        })
        // .then(function (response) {
        //     if (response.ok) {
        //         // Form submission successful
        //         console.log('Recipe uploaded successfully!');
        //         var groceryList = document.getElementById("groceryList");
        //         groceryList.innerHTML = ""; // This will remove all the child elements inside the groceryList
        //         showMessage()
        //         // Reset form
        //         document.getElementById('recipeForm').reset();
        //     } else {
        //         // Form submission failed
        //         showError('Error uploading recipe. Please try again.');
        //     }
        // })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error(error);
        });

    // Send form data to the server using fetch
    // fetch('/edit_recipe', {
    //     method: 'PUT',
    //     body: data,
    // })
    //     .then(function (response) {
    //         if (response.ok) {
    //             // Form submission successful
    //             console.log('The recipe has been successfully updated!');
    //             // Reset form
    //             document.getElementById('recipeForm').reset();
    //         } else {
    //             // Form submission failed
    //             showError('Failed to update recipe details');
    //         }
    //     })
    //     .catch(function (error) {
    //         // Network or server error
    //         showError('Failed to update recipe details');
    //     });
});

// Function to display error message
function showError(message) {
    var errorMessage = document.getElementById('error-msg');
    errorMessage.textContent = message;
}
function isPositiveInteger(value) {
    return /^\d+$/.test(value) && parseInt(value) > 0;
}
function showMessage() {
    alert("The changes were successfully saved!\nYou can exit this page safely.");
}
// Add event listener to the form save event
