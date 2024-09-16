import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    await dbConnect();
    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username});

        if(!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, {status: 404});
        }

        if(!user.isAcceptingMessages) {
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages",
            }, {status: 400});
        }

        const newMessage = {content, createdAt : new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            messages: user.messages,
        });

    } catch (error : any) {
        console.error("Failed to send message", error.message);
        return NextResponse.json({
            success: false,
            message: "Failed to send message",
        }, {status: 500});
    }
}
