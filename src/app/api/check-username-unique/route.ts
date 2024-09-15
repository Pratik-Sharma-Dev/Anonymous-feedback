import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {usernameValidation} from "@/schemas/signUpSchema";
import {z} from "zod";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        }
        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            return Response.json({
                success: false,
                message: result.error.message,
            },
            { status: 400 });
        }

        const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({username, isVerified :true});

        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            },
            { status: 400 });
        }

        if(!existingVerifiedUser) {
            return Response.json({
                success: true,
                message: "Username is unique",
            },
            { status: 200 });
        }

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Error while checking username",
        },
    { status: 500 });
    }
}