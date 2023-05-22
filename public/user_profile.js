const followersBtn = document.querySelector("#followers-btn");
const followingBtn = document.querySelector("#following-btn");
const followBtn = document.querySelector("#follow-btn");
const unfollowBtn = document.querySelector("#unfollow-btn");
const myAccountBtn = document.querySelector("#my-account-btn");
const express = require('express');
const router = express.Router();


// Set initial counts
let followersCount = 0;
let followingCount = 0;

// Event listeners for buttons
followersBtn.addEventListener("click", function() {
	// TODO: Display list of followers
});
followingBtn.addEventListener("click", function() {
	// TODO: Display list of following users
});
followBtn.addEventListener("click", function() {
	// TODO: Send follow request to user 2
	// TODO: Update button to "Unfollow"
});
unfollowBtn.addEventListener("click", function() {
	// TODO: Send unfollow request to user 2
	// TODO: Update button to "Follow"
});
myAccountBtn.addEventListener("click", function() {
	// TODO: Navigate to user's account page
});


// router.get('/user_profile', (req, res) => {
//   const user = 'Shirel Abargil'; // Replace this with req.user
//   res.render('user_profile', { user: user });
// });

module.exports = router;
