


document.addEventListener('DOMContentLoaded', function() {
  const editButton = document.querySelector('.edit');
  const fields = document.querySelectorAll('.form-control[readonly]');
  editButton.addEventListener('click', function() {
    // Specify the IDs or classes of the fields you want to make editable
    const editableFields = ['#user-name', '#firstname', '#lastname', '#Status'];

    fields.forEach(function(field) {
      const fieldId = '#' + field.getAttribute('id');
      if (editableFields.includes(fieldId)) {
        field.removeAttribute('readonly');
        field.classList.add('editable'); // Add the 'editable' class to change the color
      } else {
        field.setAttribute('readonly', 'readonly');
        field.classList.remove('editable'); // Remove the 'editable' class to revert the color
      }
    });
  });


    
    const deleteAccountBtn = document.querySelector('.delete');
    deleteAccountBtn.addEventListener('click', function(){
      // Send a request to the server to delete the user account
      fetch('/deleteAccount', {
        method: 'DELETE'
      
      })
      .then(response => {
        if (response.ok) {
          // Deletion successful, redirect to login page
          window.location.href = '/home';
        } else {
          // Handle deletion error
          console.error('Error deleting account');
        }
      })
      .catch(error => {
        // Handle any network or server error
        console.error('Error:', error);
      });
    });

    const submitButton = document.querySelector('.editsubmit');
     submitButton.addEventListener('click', function() {
      const updatedFields = ['#user-name', '#firstname','#lastname', '#Status'];
  
      fields.forEach(function(field) {
        const fieldId = '#' + field.getAttribute('id');
        if (!field.hasAttribute('readonly')) {
          updatedFields[fieldId] = field.value;
          field.setAttribute('readonly', 'readonly');
        }
      });
      const firstNameInput = document.getElementById('firstname');
      const lastNameInput = document.getElementById('lastname');
      const statusInput = document.getElementById('Status');
      const userNameInput = document.getElementById('user-name');
  
      // Get the updated value from the input field
      const updatedFirstName = firstNameInput.value;
      const updateLastName = lastNameInput.value;
      const updatedStatus = statusInput.value;
      const updatedUserName = userNameInput.value;
      // Send an HTTP request to update the value in the database
      fetch('/updateFirstName', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName: updatedFirstName ,
                               lastName: updateLastName ,
                               status : updatedStatus ,
                               username : updatedUserName
        })
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response from the server if needed
          
          console.log(data);

           // Reset the background color of the fields to white
          updatedFields.forEach(function(fieldId) {
          const field = document.querySelector(fieldId);
          field.classList.remove('editable');
      
          })

          // Display success message
          const contentDiv = document.getElementById("message");
          contentDiv.style.color = "white";
          const successMessage = "The details have been updated successfully!";
          contentDiv.innerHTML = successMessage;
        })
        .catch(error => {
          // Handle any errors that occur during the request
          console.error(error);
        });
    });

    const submitPasswordButton = document.querySelector('.submit');
    submitPasswordButton.addEventListener('click', function() {
      const oldPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
    
      // Call the changePassword function
      changePassword(oldPassword, newPassword, confirmPassword);
    });
    
    // Function to handle password change
    function changePassword(oldPassword, newPassword, confirmPassword) {
      // Check if the new password matches the confirm password
      console.log(newPassword);
      if (newPassword !== confirmPassword) {
      
        alert("New password and confirm password do not match.");
        return;
      }
      // Send an HTTP request to check if the old password is correct
      fetch('/checkOldPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword })
      })
      .then(response => response.json())
      .then(data => {
        if (data.isCorrect) {
          console.log("r");
          // Send an HTTP request to update the password
          fetch('/updatePassword', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword })
          })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the server
            console.log(data); // Replace with appropriate handling logic
          })
          .catch(error => {
            console.error(error);
            // Handle any errors that occur during the request
          });
        } else {
          alert("Old password is incorrect.");
        }
      })
      .catch(error => {
        console.error(error);
        // Handle any errors that occur during the request
      });
    }
   
    
    

  

  });