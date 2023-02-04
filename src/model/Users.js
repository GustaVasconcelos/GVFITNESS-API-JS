import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    monthlyPayment:{
        type:Date
    },
    typeUser:{
        type:String
    },
    trainingSheetOne:{
        type:Array
    },
    trainingSheetTwo:{
        type:Array
    },
    trainingSheetThree:{
        type:Array
    },
    trainingSheetFour:{
        type:Array
    },
    details:{
        type:Array
    }
    
},{
    timestamps:true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


const Users = mongoose.model("UsersDG", userSchema)

export default Users