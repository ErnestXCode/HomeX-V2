const mongoose = require('mongoose') 

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB successfully')
  } catch (err) {
    throw new Error('Could not connect to Mong0DB')
  }
}

module.exports = connectDB