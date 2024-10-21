import mongoose,{Schema} from "mongoose";

const profileSchema = new Schema({
    name:{ 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      email:{
                type: String,
                required: true,
                unique: true,
                lowecase: true,
                trim: true, 
      },
      password:{
       type:String,
         require:[true,"password is require"],
         min:[7,'Must be at least 7,got {VALUE}']   
      },
      role:{
        type: Number,
        enum : [1,2],//1 for user 2 for admin
        default: 1,
      },
      refreshToken:{
        type:String,
      },
      

},{timestamps:true})

export const EcomProfile = mongoose.model("EcomProfile",profileSchema)