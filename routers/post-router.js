const express = require('express')
const validators = require('../validators')
const db = require('../database')

const router = express.Router()

let today = new Date()
let dd = String(today.getDate()).padStart(2, '0')
let mm = String(today.getMonth() + 1).padStart(2, '0')
let yyyy = today.getFullYear()
today = yyyy + '-' + mm + '-' + dd
const date = today

router.get('/', function(request, response){
	const errors = []
	db.getAllPosts(function(error, blogg){
		
		if(error){
			errors.push(error)
			const model = {
				errors,
				blogg: []
			}
			response.render('blogg.hbs', model)
			
		}else{
			
			const model = {
				blogg
			}
			response.render('blogg.hbs', model)	
		}	
	})	
})

router.get('/createBloggPost', validators.redirection, function(request, response){
	response.render('createBloggPost.hbs')
})

router.post('/createBloggPost', function(request, response){
	
	const title = request.body.title
	const post = request.body.post

	const errors = validators.getValidationErrorsForPost(title, post)
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
	if(errors.length == 0){
		
		db.createPost(title, date, post, function(error, postId){
			
			if(error){
				
				errors.push(error)
				
				const model = {
					errors,
					title,
                    date,
					post
				}
				
				response.render('createBloggPost.hbs', model)
				
			}else{
				
				response.redirect('/blogg/'+postId)	
			}
		})
		
	}else{
		
		const model = {
			errors,
			title,
            date,
			post
		}
		
		response.render('createBloggPost.hbs', model)	
	}	
})

router.get('/:id', function(request, response){
	
	const id = request.params.id
	const errors = []
	db.getPostById(id, function(error, posts){
		if(error) errors.push(error)
		const model = {
			errors,
			posts
		}
		response.render('bloggPostContent.hbs', model)
	})	
})

router.get('/:id/update', validators.redirection, function(request, response){
	
	const id = request.params.id
	const errors = []
	
	db.getPostById(id, function(error, posts){
		const model = {
			errors,
			posts
		}
		if(error){
			model.errors.push(error)
		}
		response.render('updateBloggPost.hbs', model)	
	})
})

router.post('/:id/update', function(request, response){
	
    const id = request.params.id
	const title = request.body.title
	const post = request.body.post
	
	const errors = validators.getValidationErrorsForPost(title, post)
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
	if(errors.length == 0){
		
		db.updatePostById(id, title, date, post, function(error){
			if(error){
				errors.push(error)
				const model = {
					errors,
					guestbookPost: {
						id,
						title,
						date, 
						post
					}
				}
				response.render('updateBloggPost.hbs', model)
			}else{
			response.redirect('/blogg/'+id)
			}
		})
		
	}else{
		
		const model = {
			errors,
			posts: {
				id,
				title,
				date, 
                post
			}
		}	
		response.render('updateBloggPost.hbs', model)	
	}	
})

router.get('/:id/delete', validators.redirection, function(request, response){
	
	const id = request.params.id
	const errors = []
	
	db.getPostById(id, function(error, posts){
		if(error) errors.push(error)
		
		const model = {
			errors,
			posts
		}
		
		response.render('deleteBloggPost.hbs', model)	
	})
})

router.post('/:id/delete', function(request, response){
	
	const id = request.params.id
	const errors = []
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
	db.deletePostById(id, function(error){
		const model = {
			errors, 
			posts:  {
				id
			}
		}
		if(error){
			model.errors.push(error)
			response.render('deleteBloggPost.hbs', model)	
		}else{
			response.redirect('/blogg')	
		}
		
		
	})	
})

module.exports = router ;