import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content : string;
    createdAt : Date;
}

const MessageSchema : Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required : true, default: Date.now }
})

export interface User extends Document {
    username : string;
    email : string;
    password : string;
    messages : Message[];
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessages : boolean;
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true, "Username is required"],
        unique : true,
        trim : true,
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        trim : true,
        match : [/\S+@\S+\.\S+/, "Invalid email format"]
    },
    password : { 
        type: String, required: true
    },
    verifyCode : {
        type : String,
        required : [true, "verify code is required"]
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "verify code expiry is required"]
    },
    isVerified : {
        type: Boolean,
        default: false
    },
    isAcceptingMessages : {
        type: Boolean,
        default: true
    },
    messages: {
        type: [MessageSchema],
        default: []
    }
})

const UserModel = (mongoose.models.users as mongoose.Model<User>) 
    || mongoose.model<User>("users", UserSchema); 

export default UserModel;