
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

document.addEventListener('DOMContentLoaded', function () {

    const saveButton = document.querySelector('.save');
    saveButton.addEventListener('click', function () {
        // event.preventDefault(); // Prevent form from submitting and refreshing the page
        // showError('');
        // Get form values
        const category = document.getElementById('category').value;
        const recipeName = document.getElementById('recipeName').value.trim();
        const instructions = document.getElementById('instructions').value.trim();
        const prepTime = document.getElementById('prepTime').value.trim();
        const dishes = document.getElementById('dishes').value.trim();
        console.log(category);
        // const ingredients = getIngredients();
        // console.log(image)
        // Validate form fields
        if (recipeName.length < 5 || recipeName.length > 50) {
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
        // Validate preparation time
        if (!(isPositiveInteger(prepTime))) {
            showError('Preparation time must be a positive integer.');
            return;
        }

        // Validate number of dishes
        if (!(isPositiveInteger(dishes))) {
            showError('Number of dishes must be a positive integer.');
            return;
        }
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
        fetch('/edit_recipe', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: category,
                name: recipeName,
                instructions: instructions,
                preparationTime: prepTime,
                dishes: dishes,
            })
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server if needed
                console.log(data);
            })
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
});
// Function to display error message
function showError(message) {
    var errorMessage = document.getElementById('error-msg');
    errorMessage.textContent = message;
}

// Add event listener to the form save event
