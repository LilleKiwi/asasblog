const express = require('express')
const bcrypt = require('bcrypt');
const expressSession = require('express-session')
const connectSqlite3 = require('connect-sqlite3')
const SQLiteStore = connectSqlite3(expressSession)

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "$2b$10$/U8ur6W9zR3yuloyR9Y20OJMPnjCKrhdJBw3M0R5ygQLjFlzv9ABO"
//const saltRounds = 10;

const router = express.Router()

router.use(expressSession({
    store: new SQLiteStore({db: "session-db.db"}),
    secret: "nbvbnj32434k35356fghd67gkh45yjmtnrebs",
    saveUninitialized: false,
    resave: false
}))

router.use(function(request, response, next){
    response.locals.session = request.session
    next()
})

router.get('/login', function(request, response){
	response.render('login.hbs')
})

router.post('/login', async function(request, response){
	const username = request.body.username
	const password = request.body.password 
    const errors = []

    const successfulCompare = await bcrypt.compare(password, ADMIN_PASSWORD)
    
    if(username == ADMIN_USERNAME && successfulCompare){
        request.session.isLoggedIn = true
        response.redirect('/')
    }else{
        errors.push("Wrong username and/or wrong password")
        response.render('login.hbs', {errors})
    } 
})

router.get('/logout', function(request, response){
	response.render('login.hbs')
})

router.post('/logout', function(request, response){
	if (request.session){
        request.session.destroy()
    }
    response.redirect('/')   
})

/*bcrypt.hash(ADMIN_PASSWORD, saltRounds, function(error, hash) {
    console.log(hash)
})*/

module.exports = router