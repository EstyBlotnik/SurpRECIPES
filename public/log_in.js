document.querySelector('.img__btn').addEventListener('click', function () {
  document.querySelector('.cont').classList.toggle('s--signup');
});
// Get DOM elements
const signInForm = document.querySelector('.form.sign-in');
const signUpForm = document.querySelector('.form.sign-up');
const signUpButton = document.querySelector('.img__btn .m--up');
const signInButton = document.querySelector('.img__btn .m--in');
const emailInputs = document.querySelectorAll('input[type="email"]');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const userNameInput = document.querySelector('input[type="text"]');
const signInSubmitButton = signInForm.querySelector('.submit');
const signUpSubmitButton = signUpForm.querySelector('.submit');



// Add event listeners for switching between sign-in and sign-up forms
signInButton.addEventListener('click', () => {
  signUpForm.style.display = 'none';
  signInForm.style.display = 'block';
});

signUpButton.addEventListener('click', () => {
  signInForm.style.display = 'none';
  signUpForm.style.display = 'block';
});

// Add event listeners for form submissions
signInSubmitButton.addEventListener('click', signIn);
signUpSubmitButton.addEventListener('click', signUp);

// Email validation regex pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to validate email format
function validateEmail(email) {
  return emailPattern.test(email);
}

// Function to validate password length
function validatePassword(password) {
  const minLength = 6;
  const maxLength = 20;
  return password.length >= minLength && password.length <= maxLength;
}

// Function to validate username length
function validateUserName(username) {
  const minLength = 4;
  const maxLength = 20;
  return username.length >= minLength && username.length <= maxLength;
}


// Function to hide error message
function hideError(element) {
  const errorContainer = element.parentElement.querySelector('.error-message');
  errorContainer.textContent = '';
  element.classList.remove('error');
}

// Function to handle sign in form submission
// Function to handle sign in form submission

function signIn(event) {
  event.preventDefault();
  console.log('Sign in');
  const errorMsgIn = document.getElementById('error-msg-in');
  errorMsgIn.textContent = '';
  // Validate email and password
  const email = signInForm.querySelector('input[type="email"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;

  if (!validateEmail(email)) {
    errorMsgIn.textContent = 'Invalid email, try again. ';
    return;
  }

  if (!validatePassword(password)) {
    errorMsgIn.textContent = 'Password must be between 6 and 20 characters';
    return;
  }

  // Perform sign in logic here
  fetch('/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then(response => response.json())
    .then(data => {
      // Check if the response contains a redirect URL
      if (data.redirect) {
        // Redirect to the specified URL
        window.location.href = data.redirect;
      } else {
        // Handle other types of responses if needed
        console.log(data);
      }
    })
    .catch(error => {
      console.error('Sign in error:', error);
      console.error(error.stack);

      // Display the error message to the user
      const errorMsgUp = document.getElementById('error-msg-in');
      errorMsgUp.textContent = 'Login failed, verify your details again..';
    });
}



// function signIn(event) {
//   event.preventDefault();
//   console.log('Sign in');
//   const errorMsgIn = document.getElementById('error-msg-in');
//   errorMsgIn.textContent = '';
//   // Validate email and password
//   const email = signInForm.querySelector('input[type="email"]').value;
//   const password = signInForm.querySelector('input[type="password"]').value;

//   if (!validateEmail(email)) {
//     errorMsgIn.textContent = 'Invalid email, try again. ';
//     return;
//   }

//   if (!validatePassword(password)) {
//     errorMsgIn.textContent = 'Password must be between 6 and 20 characters';
//     return;
//   }

//   // Perform sign in logic here
//   fetch('/auth/signin', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       email: email,
//       password: password,
//     }),
//   })
//   .then(response => response.json())
//   .then(data => window.location.href = data.redirect)
//   .catch(error => {
//       console.error('Sign in error:', error);
//       console.error(error.stack);

//       // Display the error message to the user
//       const errorMsgUp = document.getElementById('error-msg-in');
//       errorMsgUp.textContent = 'Login failed, verify your details again..';
//     });
// }
// Function to handle sign up form submission
function signUp(event) {
  event.preventDefault();
  console.log('Sign up');
  const errorMsgUp = document.getElementById('error-msg-up');
  errorMsgUp.textContent = '';
  // Validate email, password, and username
  const email = signUpForm.querySelector('input[type="email"]').value;
  const password = signUpForm.querySelector('input[type="password"]').value;

  // Retrieve the value of the "confirm-password" field
  const confirmPassword = signUpForm.querySelector('input[type="password"][name="confirm-password"]').value;

  // Retrieve the value of the username input field
  const username = userNameInput.value.trim();;
  console.log(username);
  if (username === '') {
    errorMsgUp.textContent = 'Enter a username';
    return;
  }
  if (!validateEmail(email)) {
    errorMsgUp.textContent = 'Invalid email, try again. ';
    return;
  }

  if (!validatePassword(password)) {
    errorMsgUp.textContent = 'Password must be between 6 and 20 characters';
    return;
  }

  if (password !== confirmPassword) {
    errorMsgUp.textContent = 'Passwords do not match';

    return;
  }

  // Perform sign up logic here
  fetch('/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
      username: username,
    }),
  })
    .then(response => response.json())
    .then(data => window.location.href = data.redirect)
    .catch(error => {
      console.error('Registration error:', error);
      console.error(error.stack);

      // Display the error message to the user
      const errorMsgUp = document.getElementById('error-msg-up');
      errorMsgUp.textContent = 'The user already exists.';
    });

}

function showError(element, message) {
  const errorContainer = element.parentElement.querySelector('.error-message');
  if (errorContainer) {
    errorContainer.textContent = message;
    element.classList.add('error');
  }
}

