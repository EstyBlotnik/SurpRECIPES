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
