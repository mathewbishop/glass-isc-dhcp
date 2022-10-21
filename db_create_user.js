var sqlite3 = require('sqlite3')
var crypto = require('crypto')
var path = require('path')
var db = new sqlite3.Database(path.join(__dirname, '.db/glass.db'))
var readlineSync = require('readline-sync')

var username = readlineSync.question('Username: ')
var password = readlineSync.question('Password: ')

db.serialize(function () {
  // create the database schema for the todos app
  db.run(
    'CREATE TABLE IF NOT EXISTS users ( \
          id INTEGER PRIMARY KEY, \
          username TEXT UNIQUE, \
          hashed_password BLOB, \
          salt BLOB \
        )'
  )

  var salt = crypto.randomBytes(16)
  db.run(
    'INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)',
    [username, crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256'), salt]
  )
})

module.exports = db