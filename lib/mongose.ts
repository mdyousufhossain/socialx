import mongoose from 'mongoose'

const connectionToDatabase = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) return console.log('missing url')
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'socialapp'
    })
  } catch (error) {
    console.error(error)
  }
}

export default connectionToDatabase
