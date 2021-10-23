const express = require('express')
const expressHandlebars = require('express-handlebars')
const authRouter = require('./routers/auth-router')
const postRouter = require('./routers/post-router')
const faqRouter = require('./routers/faq-router')
const guestbookRouter = require('./routers/guestbook-router')
const csurfToken = require('csurf')
const cookiePars = require('cookie-parser')

const app = express()

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/static', express.static("public"))

app.engine("hbs", expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials',
    layoytsDir: __dirname + '/views/layouts'
}))

app.use(cookiePars())
app.use(csurfToken({cookie: true}))

app.use(function(request, response, next){
    response.locals.csurfToken = request.csrfToken()
    next()
})

app.use('', authRouter)
app.use('/blogg', postRouter)
app.use('/faqs', faqRouter)
app.use('/guestbook', guestbookRouter)

app.get('/', function(request, response)
{
    const model = {
        pageText: 'index'
    }
    response.render("index.hbs", model)
})

app.get('/about', function(request, response)
{
    const model = {
        pageText: 'about'
    }
    response.render("about.hbs", model)
})

app.get('/contact', function(request, response)
{
    const model = {
        pageText: 'contact'
    }
    response.render("contact.hbs", model)
})

app.use(express.static(__dirname + '/public'))

app.listen(8080)