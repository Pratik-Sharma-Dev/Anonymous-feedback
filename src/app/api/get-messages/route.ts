import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;
    console.log("session is " + session)
    console.log("user is " + user.username)

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, 
        { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        // get the most recent messages for the user by aggregation pipeline
        const user : any = await UserModel.aggregate([
            {$match : { _id: userId}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt' : -1}},
            {$group : {_id : '$id', messages : {$push : '$messages'}}},
        ])

        if(!user && user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            },
            { status: 401 })
        }

        return Response.json({
            success: true,
            message: "User messages retrieved successfully",
            messages: user[0].messages
        },
        { status: 200 })
    } catch (error) {
        console.log("failed to get the user messages")
        return Response.json({
            success: false,
            message: "Failed to get the user messages"
        },{
            status: 500
        });
    }

}