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
	db.getAllGuestbookPosts(function(error, guestbook){
		
		if(error){
			errors.push(error)
			const model = {
				errors,
				guestbook: []
			}
			response.render('guestbook.hbs', model)
			
		}else{
			
			const model = {
				guestbook
			}
			response.render('guestbook.hbs', model)	
		}	
	})	
})

router.get('/createGuestbookPost', function(request, response){
	response.render('createGuestbookPost.hbs')
})

router.post('/createGuestbookPost', function(request, response){
	
	const name = request.body.name
	const post = request.body.post

	const errors = validators.getValidationErrorsForGuestbook(name, post)
	
	if(errors.length == 0){
		
		db.createGuestbookPost(name, date, post, function(error, postId){
			
			if(error){
				
				errors.push(error)
				
				const model = {
					errors,
					name,
                    date,
					post
				}
				
				response.render('createGuestbookPost.hbs', model)
				
			}else{
				
				response.redirect('/guestbook/'+postId)	
			}
		})
		
	}else{
		
		const model = {
			errors,
			name,
            date,
			post
		}
		response.render('createGuestbookPost.hbs', model)	
	}	
})

router.get('/:id', function(request, response){
	
	const id = request.params.id
	const errors = []
	db.getGuestbookPostById(id, function(error, guestbookPost){
		if (error) errors.push(error)
		const model = {
			errors,
			guestbookPost
		}
		response.render('guestbookPostContent.hbs', model)
	})	
})

router.get('/:id/update', validators.redirection, function(request, response){
	
	const id = request.params.id
	const errors = []
	db.getGuestbookPostById(id, function(error, guestbookPost){
		const model = {
			errors,
			guestbookPost
		}
		if(error) {
			model.errors.push(error)			
		} 
		response.render('updateGuestbookPost.hbs', model)		
	})
})

router.post('/:id/update', function(request, response){
	
    const id = request.params.id
	const name = request.body.name
	const post = request.body.post
	
	const errors = validators.getValidationErrorsForGuestbook(name, post)
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
	if(errors.length == 0){
		
		db.updateGuestbookPostById(id, name, date, post, function(error){
			if(error) {
				errors.push(error)
				const model = {
					errors,
					guestbookPost: {
						id,
						name,
						date, 
						post
					}
				}
				response.render('updateGuestbookPost.hbs', model)
			} else {
				response.redirect('/guestbook/'+id)
			}
		})
		
	}else{
		const model = {
			errors,
			guestbookPost: {
				id,
				name,
				date, 
                post
			}
		}	
		response.render('updateGuestbookPost.hbs', model)	
	}	
})

router.get('/:id/delete', validators.redirection, function(request, response){
	
	const id = request.params.id
	const errors = []
	db.getGuestbookPostById(id, function(error, guestbookPost){
		if(error) errors.push(error)
		
		const model = {
			errors,
			guestbookPost
		}
		
		response.render('deleteGuestbookPost.hbs', model)	
	})
})

router.post('/:id/delete', function(request, response){
	
	const id = request.params.id
	const errors = []
	db.deleteGuestbookPostById(id, function(error){
		const model = {
			errors,
			guestbookPost: {
				id
			}
		}
		if(error) {
			model.errors.push(error)
			response.render('deleteGuestbookPost.hbs', model)
		} else {
			response.redirect('/guestbook')	
		}
	})	
})

module.exports = router;