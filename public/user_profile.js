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

const likeboxes = document.querySelectorAll('button.like');
likeboxes.forEach(likebox => {
  likebox.addEventListener('click', (e) => {
	const endpoint = `/viewRecipe/like`;
	const data = {
	  userId: likebox.dataset.user,
	  postId: likebox.dataset.doc,
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

// const unlikeboxes = document.querySelectorAll('button.unlike');
// unlikeboxes.forEach(unlikebox => {
//   unlikebox.addEventListener('click', (e) => {
// 	const endpoint = `/viewRecipe/unlike`;
// 	const data = {
// 	  userId: unlikebox.dataset.user,
// 	  postId: unlikebox.dataset.doc,
// 	};
// 	fetch(endpoint, {
// 	  method: 'POST',
// 	  headers: {
// 		'Content-Type': 'application/json',
// 	  },
// 	  body: JSON.stringify(data),
// 	})
// 	  .then(response => response.json())
// 	  .then(data => window.location.href = data.redirect)
// 	  .catch(err => console.log(err));
//   });
// });


const saveboxes = document.querySelectorAll('button.save');
saveboxes.forEach(savebox => {
  savebox.addEventListener('click', (e) => {
	const endpoint = `/viewRecipe/save`;
	const data = {
	  userId: savebox.dataset.user,
	  postId: savebox.dataset.doc,
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

const unsaveboxes = document.querySelectorAll('button.unsave');
unsaveboxes.forEach(unsavebox => {
  unsavebox.addEventListener('click', (e) => {
	const endpoint = `/viewRecipe/unsave`;
	const data = {
	  userId: unsavebox.dataset.user,
	  postId: unsavebox.dataset.doc,
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

const shareboxes = document.querySelectorAll('button.share');
shareboxes.forEach(sharebox => {
  sharebox.addEventListener('click', (e) => {
	const endpoint = `/viewRecipe/share`;
	const data = {
	  userId: sharebox.dataset.user,
	  postId: sharebox.dataset.doc,
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