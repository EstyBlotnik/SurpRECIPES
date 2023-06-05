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
// Function to retrieve the ingredients as an array
function getIngredients() {
  var groceryList = document.getElementById('groceryList');
  var ingredients = [];

  for (var i = 0; i < groceryList.children.length; i++) {
    var listItem = groceryList.children[i];
    ingredients.push(listItem.textContent);
  }

  return ingredients;
}

// Function to handle form submission
function submitForm(event) {
  event.preventDefault(); // Prevent form from submitting and refreshing the page
  showError('');

  // Get form values
  var category = document.getElementById('category').value;
  var recipeName = document.getElementById('recipeName').value.trim();
  var instructions = document.getElementById('instructions').value.trim();
  var prepTime = document.getElementById('prepTime').value.trim();
  var dishes = document.getElementById('dishes').value.trim();
  var image = document.getElementById('image').files[0]; // Get the selected image file
  var ingredients = getIngredients();
  console.log(ingredients)
  // Validate form fields
  if (category === '') {
    showError('Please select a category.');
    return;
  }
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
if (!isPositiveInteger(prepTime)) {
  showError('Preparation time must be a positive integer.');
  return;
}

// Validate number of dishes
if (!isPositiveInteger(dishes)) {
  showError('Number of dishes must be a positive integer.');
  return;
}
  // Create a new FormData object
  var formData = new FormData();
  formData.append('category', category);
  formData.append('name', recipeName);
  formData.append('instructions', instructions);
  formData.append('preparationTime', prepTime);
  formData.append('dishes', dishes);
  formData.append('ingredients', JSON.stringify(ingredients));
  formData.append('image', image); // Append the image file to the FormData object
  // Send form data to the server using fetch
  fetch('/recipe/upload', {
    method: 'POST',
    body: formData,
  })
    .then(function(response) {
      if (response.ok) {
        // Form submission successful
        console.log('Recipe uploaded successfully!');
        var groceryList = document.getElementById("groceryList");
        groceryList.innerHTML = ""; // This will remove all the child elements inside the groceryList
        showMessage() 
        // Reset form
        document.getElementById('recipeForm').reset();
      } else {
        // Form submission failed
        showError('Error uploading recipe. Please try again.');
      }
    })
    .catch(function(error) {
      // Network or server error
      showError('Error uploading recipe. Please try again.');
    });
}

// Function to display error message
function showError(message) {
  var errorMessage = document.getElementById('error-msg');
  errorMessage.textContent = message;
}

// Add event listener to the form submit event
document.getElementById('recipeForm').addEventListener('submit', submitForm);



function showMessage() {
  alert("Your recipe are saved.");
}



// Function to check if a value is a positive integer
function isPositiveInteger(value) {
  return /^\d+$/.test(value) && parseInt(value) > 0;
}
// Validate other form fields as needed



