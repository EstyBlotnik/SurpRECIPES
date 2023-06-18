const followersBtn = document.querySelector("#followers-btn");
const followingBtn = document.querySelector("#following-btn");
const followBtn = document.querySelector("#follow-btn");
const unfollowBtn = document.querySelector("#unfollow-btn");
const myAccountBtn = document.querySelector("#my-account-btn");


// Set initial counts
let followersCount = 0;
let followingCount = 0;


function redirectToUserAccount() {
	// Redirect to the user_account page
	window.location.href = '/user_account';
  }
const followboxes = document.querySelectorAll('button.follow-btn');
followboxes.forEach(followbox => {
	followbox.addEventListener('click', (e) => {
		const endpoint = `/viewRecipe/follow`;
		const data = {
			currentUserId: followbox.dataset.user,
			uploaderId: followbox.dataset.uploader,
		};
		fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(data => window.location.href = data.redirect)
			.catch(err => console.log(err));
	});
});

const unfollowboxes = document.querySelectorAll('button.unfollow-btn');
unfollowboxes.forEach(unfollowbox => {
	unfollowbox.addEventListener('click', (e) => {
		const endpoint = `/viewRecipe/unfollow`;
		const data = {
			currentUserId: unfollowbox.dataset.user,
			uploaderId: unfollowbox.dataset.uploader,
		};
		fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(data => window.location.href = data.redirect)
			.catch(err => console.log(err));
	});
});

const trashcans = document.querySelectorAll('button.delete');
trashcans.forEach(trashcan => {
  trashcan.addEventListener('click', (e) => {
	const endpoint = `/viewRecipe/${trashcan.dataset.doc}`;
	fetch(endpoint, {
	  method: 'DELETE',
	})
	  .then(response => response.json())
	  .then(data => window.location.href = data.redirect)
	  .catch(err => console.log(err));
  });
});

const ingbuttons = document.getElementsByName("ingButton");
ingbuttons.forEach(button => {
  const doc = button.dataset.doc;
  const element1 = document.getElementById('ing-' + doc);
  if (element1) {
	element1.style.display = 'none';
  }
  const element2 = document.getElementById('ins-' + doc);
  if (element2) {
	element2.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const ingbuttons = document.getElementsByName("ingButton");
  const insbuttons = document.getElementsByName("insButton");
  ingbuttons.forEach(button => {
	button.addEventListener('click', handleClick);
  });
  insbuttons.forEach(button => {
	button.addEventListener('click', shandleClick);
  });
});

function handleClick(event) {
  const button = event.target;
  const doc = button.dataset.doc;
  console.log('Button clicked:', button, 'Data-doc:', doc);
  const element = document.getElementById('ing-' + doc);
  console.log('ing' + doc);
  if (element) {
	if (element.style.display === 'none') {
	  element.style.display = 'block';
	} else {
	  element.style.display = 'none';
	}
	// console.log("found it");
	// element.style.display = 'none';
  }
  // Perform further actions with the doc value
}

function shandleClick(event) {
  const button = event.target;
  const doc = button.dataset.doc;
  console.log('Button clicked:', button, 'Data-doc:', doc);
  const element = document.getElementById('ins-' + doc);
  console.log('ing' + doc);
  if (element) {
	if (element.style.display === 'none') {
	  element.style.display = 'block';
	} else {
	  element.style.display = 'none';
	}
	// console.log("found it");
	// element.style.display = 'none';
  }
  // Perform further actions with the doc value
}

function updateHiddenInputValue(postId) {
    var textbox = document.getElementById('comment-textbox' + postId);
    var hiddenInput = document.getElementById('comment-textid' + postId);
    hiddenInput.value = textbox.value;
  }

  const commentToggles = document.querySelectorAll('button.comment-toggle');
  commentToggles.forEach(commentToggle => {
	commentToggle.addEventListener('click', (e) => {
	  const commentBox = document.querySelector(`#comment-box-${commentToggle.dataset.doc}`);
	  commentBox.classList.toggle('show');
	});
  });
  function chngeText(event) {
	const button = event.target;
	const doc = button.dataset.doc;
	// console.log('Button clicked:', button, 'Data-doc:', doc);
	// const element = document.getElementById('ing-' + doc);
	// console.log('ing' + doc);
	var commentTextbox = event.target.parentNode.querySelector('.comment-textbox'+ doc);
	  var commentText = commentTextbox.value;

	  // Set the value of the corresponding comment text input
	  var commentTextInput = event.target.parentNode.querySelector('.comment-text'+ doc);
	  commentTextInput.value = commentText;

	  // Submit the form
	  event.target.parentNode.submit();
  }

  // const commentTextboxes = document.querySelectorAll('.comment-button')
  // commentTextboxes.forEach(commentTextbox => {
  //   commentTextbox.addEventListener('click', function() {
  //     var commentTextbox = document.getElementById('comment-textbox');
  //     var commentText = commentTextbox.value;
  //     document.getElementById('comment-text').value = commentText;
  //   });
  // });

function updateHiddenInputValue(postId) {
  var textbox = document.getElementById('comment-textbox' + postId);
  var hiddenInput = document.getElementById('comment-textid' + postId);
  hiddenInput.value = textbox.value;
}

const deleteComment = (commentId) => {
  fetch(`/deleteComment?commentId=${commentId}`, {
	method: 'DELETE'
  })
	.then(response => {
	  if (response.ok) {
		// Deletion successful
		console.log('Comment deleted successfully');
		// Perform any necessary UI updates
		location.reload(); // Refresh the page
	  } else {
		// Handle deletion error
		console.error('Failed to delete comment');
		// Perform any necessary error handling or UI updates
	  }
	})
	.catch(error => {
	  // Handle network errors
	  console.error(error);
	});
};

const deleteButtons = document.querySelectorAll('.delete-comment-button');
deleteButtons.forEach(button => {
  button.addEventListener('click', (event) => {
	event.preventDefault();
	const commentId = button.dataset.doc;
	deleteComment(commentId);
  });
});


function submitComment(event, postId) {
    event.preventDefault();
    const textarea = document.getElementById(`comment-textbox${postId}`);
    const commentError = document.getElementById("comment-error-message");

    const text = textarea.value.trim();
    if (text.length === 0) {
      return;
    }

    if (text.length > 300) {
      commentError.textContent = "Comment length should not exceed 300 characters";
      commentError.style.display = "block";
      return;
    }

    // Proceed with form submission
    document.getElementById(`comment-textid${postId}`).value = text;
    event.target.submit();
  }

  function confirmDelete(event) {
    const shouldDelete = confirm("Are you sure you want to delete this comment?");
    if (!shouldDelete) {
      event.preventDefault();
    }
  }

  