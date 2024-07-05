import mongoose from "mongoose"

const connectDB = async() => {
    try {
      const mongoURI = process.env.MONGO_URI
      if(!mongoURI) throw new Error("MONGO_URI is not defined in environment variables")
      const connect = await mongoose.connect(mongoURI)  
      console.log(`MongoDB Connected : ${connect.connection.host}`)
    } catch (error) {
        console.log("Error :", error)
        process.exit(1)
    }
}

export default connectDB