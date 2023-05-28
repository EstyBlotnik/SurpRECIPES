
exports.renderIndex = (req, res) => {
  res.render('index');
};

exports.renderLogIn = (req, res) => {
  const message = req.flash('message')[0];
  res.render('login', { error: '' });
};


exports.renderCcntact = (req, res) => {
  res.render('contact');
};

exports.renderAbout = (req, res) => {
  console.log("user---------------------",req.user);
  console.log(req.isAuthenticated());
  res.render('about',{user: req.user});
};
