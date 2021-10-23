const MIN_TITLE_LENGTH = 3
const MIN_POST_LENGTH = 5

const MIN_QUESTION_LENGTH = 3
const MIN_ANSWER_LENGTH = 5

const MIN_NAME_LENGTH = 3
const MIN_GUESTBOOKPOST_LENGTH = 5

exports.getValidationErrorsForPost = function(title, post){
	
	const validationErrors = []
	
	if(!title){
		validationErrors.push("The title is missing.")
	}else if(title.length < MIN_TITLE_LENGTH){
		validationErrors.push("The title needs to be at least "+MIN_TITLE_LENGTH+" characters.")
	}
	
	if(!post){
		validationErrors.push("The post is missing.")
	}else if(post.length < MIN_POST_LENGTH){
		validationErrors.push("The post needs to be at least "+MIN_POST_LENGTH+" characters.")
	}
	
	return validationErrors
}

exports.getValidationErrorsForFAQ = function(question, answer){
	
	const validationErrors = []

	if(!question){
		validationErrors.push("The question is missing.")
	}else if(question.length < MIN_QUESTION_LENGTH){
		validationErrors.push("The question needs to be at least "+MIN_QUESTION_LENGTH+" characters.")
	}
	
	if(!answer){
		validationErrors.push("The answer is missing.")
	}else if(answer.length < MIN_ANSWER_LENGTH){
		validationErrors.push("The answer needs to be at least "+MIN_ANSWER_LENGTH+" characters.")
	}
	
	return validationErrors
	
}

exports.getValidationErrorsForGuestbook = function(name, post){
	
	const validationErrors = []
	
	if(!name){
		validationErrors.push("The name is missing.")
	}else if(name.length < MIN_NAME_LENGTH){
		validationErrors.push("The name needs to be at least "+MIN_NAME_LENGTH+" characters.")
	}
	
	if(!post){
		validationErrors.push("The post is missing.")
	}else if(post.length < MIN_GUESTBOOKPOST_LENGTH){
		validationErrors.push("The post needs to be at least "+MIN_GUESTBOOKPOST_LENGTH+" characters.")
	}
	
	return validationErrors
}

exports.redirection = function (request, response, next) {
    const isLoggedIn = request.session.isLoggedIn
    if (!isLoggedIn)
        response.redirect('/')
    else
        next();
}