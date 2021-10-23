const sqlite = require('sqlite3')
const db = new sqlite.Database('database.db')

//----------------Blogg Database----------------//
db.run(`
    CREATE TABLE IF NOT EXISTS blogg (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        date DATE,
        post TEXT
    )
`)

exports.getAllPosts = function(callback){
	
	const query = "SELECT * FROM blogg ORDER BY id DESC"
	
	db.all(query, function(error, blogg){
		callback(error, blogg)
	})
	
}

exports.createPost = function(title, date, post, callback){
	
	const query = "INSERT INTO blogg (title, date, post) VALUES (?, ?, ?)"
	const values = [title, date, post]
	
	db.run(query, values, function(error){
		callback(error, this.lastID)
	})
	
}

exports.getPostById = function(id, callback){
	
	const query = "SELECT * FROM blogg WHERE id = ? LIMIT 1"
	const values = [id]
	
	db.get(query, values, function(error, posts){
		callback(error, posts)
	})
	
}

exports.updatePostById = function(id, title, date, post, callback){
	
	const query = "UPDATE blogg SET title = ?, date = ?, post = ? WHERE id = ?"
	const values = [title, date, post, id]
	
	db.run(query, values, function(error){
		callback(error)
	})
	
}

exports.deletePostById = function(id, callback){
	
	const query = "DELETE FROM blogg WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
		callback(error)
	})
	
}

//----------------FAQ Database----------------//
db.run(`
    CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        answer TEXT
    )
`)

exports.getAllFAQ = function(callback){
	
	const query = "SELECT * FROM faqs"
	
	db.all(query, function(error, faqs){
		callback(error, faqs)
	})
	
}

exports.createFAQ = function(question, answer, callback){
	
	const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)"
	const values = [question, answer]
	
	db.run(query, values, function(error){
		callback(error)
	})
}

exports.getFAQById = function(id, callback){
	
	const query = "SELECT * FROM faqs WHERE id = ? LIMIT 1"
	const values = [id]
	
	db.get(query, values, function(error, faq){
		callback(error, faq)
	})
}

exports.updateFAQById = function(id, question, answer, callback){
	
	const query = "UPDATE faqs SET question = ?, answer = ? WHERE id = ?"
	const values = [question, answer, id]
	
	db.run(query, values, function(error){
		callback(error)
	})
}

exports.deleteFAQById = function(id, callback){
	
	const query = "DELETE FROM faqs WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
		callback(error)
	})
	
}

//----------------Guestbook Database----------------//
db.run(`
    CREATE TABLE IF NOT EXISTS guestbook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
		date DATE,
        post TEXT
    )
`)

exports.getAllGuestbookPosts = function(callback){
	
	const query = "SELECT * FROM guestbook ORDER BY id DESC"
	
	db.all(query, function(error, guestbook){
		callback(error, guestbook)
	})
}

exports.createGuestbookPost = function(name, date, post, callback){
	
	const query = "INSERT INTO guestbook (name, date, post) VALUES (?, ?, ?)"
	const values = [name, date, post]
	
	db.run(query, values, function(error){
		callback(error, this.lastID)
	})
}

exports.getGuestbookPostById = function(id, callback){
	
	const query = "SELECT * FROM guestbook WHERE id = ? LIMIT 1"
	const values = [id]
	
	db.get(query, values, function(error, guestbookPost){
		callback(error, guestbookPost)
	})
}

exports.updateGuestbookPostById = function(id, name, date, post, callback){
	
	const query = "UPDATE guestbook SET name = ?, date = ?, post = ? WHERE id = ?"
	const values = [name, date, post, id]
	
	db.run(query, values, function(error){
		callback(error)
	})
}

exports.deleteGuestbookPostById = function(id, callback){
	
	const query = "DELETE FROM guestbook WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
		callback(error)
	})
}