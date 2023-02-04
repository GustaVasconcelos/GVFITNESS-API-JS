import mongoose from "mongoose";

mongoose.set("strictQuery", true);
const connectDatabase = () => {
    console.log("Wait connecting to the database")

    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Mongo Atlas connected")
    }).catch((err) => {
        console.log(err)
    })
}

export default connectDatabase