const passport = require('passport')
module.exports = app => {
app.get('/auth/google',
  passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));

app.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/api/cur_user',
        failureRedirect: '/auth/google/failure'
}));

// Route to get user info 
app.get('/api/cur_user',( req, res)=>{
res.send(req.user)
})

//logout the current user
app.get('/api/logout',(req, res)=> {
      req.logout();
     res.redirect('/auth/google');
     res.send("Logout successfully ",req.user)
})
}