import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

// Endpoint to update user's preference to accept messages

export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, 
        { status: 401 })
    }

    const userId = user._id;
    const {acceptMesssages} = await req.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessages : acceptMesssages}, {new : true});
        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to update messages"
            },{
                status: 401
            });
        }

        return Response.json({
            success: true,
            message: "User status updated successfully",
            updatedUser
        }, {
            status: 200
        });

    } catch (error) {
        console.log("failed to update user status to update messages");
        return Response.json({
            success: false,
            message: "Failed to update user status to update messages"
        },{
            status: 500
        });
    }
}

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, 
        { status: 401 })
    }

    const userId = user._id;
    const foundUser = await UserModel.findById(userId);

    try {
        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            });
        }
    
        return Response.json({
            success: true,
            message: "User status retrieved successfully",
            isAcceptingMessages : foundUser.isAcceptingMessages
        }, {
            status: 200
        })
    } catch (error) {
        console.log("failed to get the user status to update messages")
        return Response.json({
            success: false,
            message: "Failed to get the user status to update messages"
        },{
            status: 500
        });
    }
}