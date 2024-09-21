import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Import Next.js response helper
import { User } from "next-auth";

export async function DELETE(req: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;
    console.log("MessageId is ", messageId);

    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    try {
        const userId = user._id
        // Make sure user._id exists in the session data.
        const updateResult = await UserModel.updateOne({ _id: userId }, {
            $pull: { messages: { _id: messageId } }
        });

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Failed to delete message"
            }, { status: 500 });
        }
        
        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting message: ", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete message"
        }, { status: 500 });
    }
}
