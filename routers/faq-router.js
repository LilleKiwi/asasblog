const express = require('express')
const validators = require('../validators')
const db = require('../database')

const router = express.Router()

router.get('/', function(request, response){
	const errors = []
	db.getAllFAQ(function(error, faqs){
		
		if(error){
			errors.push(error)
			const model = {
				errors,
				faqs: []
			}
			response.render('faqs.hbs', model)
			
		}else{
			
			const model = {
				faqs
			}
			response.render('faqs.hbs', model)	
		}	
	})	
})

router.get('/createFAQPost', validators.redirection, function(request, response){
	response.render('createFAQPost.hbs')
})

router.post('/createFAQPost', function(request, response){
	
	const question = request.body.question
    const answer = request.body.answer
	
	const errors = validators.getValidationErrorsForFAQ(question, answer)
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
	if(errors.length == 0){
		
		db.createFAQ(question, answer, function(error){
			
			if(error){
				
				errors.push(error)
				
				const model = {
					errors,
					question,
                    answer
				}
				
				response.render('createFAQPost.hbs', model)
				
			}else{
				
				response.redirect('/faqs/')	
			}
		})
		
	}else{
		
		const model = {
			errors,
			question,
            answer
		}
		response.render('createFAQPost.hbs', model)	
	}	
})

router.get('/:id', function(request, response){
	
	const id = request.params.id
	const errors = []
	db.getFAQById(id, function(error, faq){
		if(error) errors.push(error)
		const model = {
			errors,
			faq	
		}
		response.render('faqPostContent.hbs', model)
	})	
})

router.get('/:id/update', validators.redirection, function(request, response){
	
	const id = request.params.id
	const errors = []
	db.getFAQById(id, function(error, faq){
		const model = {
			errors,
			faq	
		}
		if(error){
			model.errors.push(error)
		}
		response.render('updateFAQPost.hbs', model)
	})
})

router.post('/:id/update', function(request, response){
	
    const id = request.params.id
	const question = request.body.question
    const answer = request.body.answer
	
	const errors = validators.getValidationErrorsForFAQ(question, answer)
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
	if(errors.length == 0){
		
		db.updateFAQById(id, question, answer, function(error){
			if(error){
				errors.push(error)
				const model = {
					errors,
					faq: {
						id,
						question,
						answer
					}
				}
				response.render('updateFAQPost.hbs', model)	
			}else{	
				response.redirect('/faqs/'+id)
			}
		})	
		
	}else{
		const model = {
			errors,
			faq: {
				id,
				question,
				answer
			}
		}
		response.render('updateFAQPost.hbs', model)	
	}	
})

router.get('/:id/delete', validators.redirection,function(request, response){
	
	const id = request.params.id
	const errors = []
	db.getFAQById(id, function(error, faq){
		if(error) errors.push(error)

		const model = {
			errors,
			faq
		}
		
		response.render('deleteFAQPost.hbs', model)	
	})
})

router.post('/:id/delete', function(request, response){
	
	const id = request.params.id
	const errors = []

	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	db.deleteFAQById(id, function(error){
		const model = {
			errors,
			faq: {
				id
			}
		}
		if(error){
			model.errors.push(error)
			response.render('deleteFAQPost.hbs', model)	
		}else{
			response.redirect('/faqs')
		}
	})	
})

module.exports = router ;