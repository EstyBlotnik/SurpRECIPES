document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.querySelector('.edit');
    const fields = document.querySelectorAll('.form-control[readonly]');
    editButton.addEventListener('click', function() {
    // Specify the IDs or classes of the fields you want to make editable
    const editableFields = ['#user-name', '#firstname','#lastname', '#Status'];
  
    fields.forEach(function(field) {
      const fieldId = '#' + field.getAttribute('id');
      if (editableFields.includes(fieldId)) {
      field.removeAttribute('readonly');
      } else {
      field.setAttribute('readonly', 'readonly');
      }
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
        })
        .catch(error => {
          // Handle any errors that occur during the request
          console.error(error);
        });
    });
  });