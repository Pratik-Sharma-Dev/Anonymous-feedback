import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { SessionContext } from "next-auth/react";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id : "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any) : Promise<any> {
                await dbConnect()

                try {
                const User = await UserModel.findOne({
                        $or:[
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!User) {
                        throw new Error("No user found with that email or username")
                    }

                    if(!User.isVerified) {
                        throw new Error("Your account has not been verified yet")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, User.password)

                    if(isPasswordCorrect) {
                        return User
                    } else {
                        throw new Error("Incorrect password")
                    }

                } catch (error : any) {
                    throw new Error(error)
                }
            }
        })
    ],

    callbacks : {
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        }
    },
    pages:{
        signIn : '/sign-in'
    },
    session : {
        strategy : "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,


}