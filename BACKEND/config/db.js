const mongoose = require('mongoose') 

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB successfully')
  } catch (err) {
    throw new Error('Could not connct to MongDB')
  }
}

module.exports = connectDB