
exports.renderIndex = (req, res) => {
  res.render('index');
};

exports.renderLogIn = (req, res) => {
  const message = req.flash('message')[0];
  res.render('login', { error: '' });
};

exports.renderAbout = (req, res) => {

  res.render('about');
};
