const mongoose = require('mongoose')

const CONNECTION_URL = 'mongodb://localhost:27017/leave';

const dbconnection = async () => {
try {
  await mongoose.connect(CONNECTION_URL)
  console.log("Database connected successfully")
} catch (error) {
  console.log(error)
}
}

module.exports = dbconnection;