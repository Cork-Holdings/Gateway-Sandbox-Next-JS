
import { api_endpoints } from "@/utils/api_constants";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the built-in session type
declare module "next-auth" {
    interface Session {
        id?: string;
        accessToken?: string;
        role?: string;
        isFirstTimeLogin?: string;
        permissions?: string[];
        refreshToken?: string;
        emailVerified?: boolean;
        accountStatus:string;
        email:string;
    }

    interface User {
        id: string;
        accessToken?: string;
        role?: string;
        isFirstTimeLogin?: string;
        permissions?: string[];
        refreshToken?: string;
        emailVerified?: boolean;
        accountStatus:string;
        email:string;
    }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
        refreshToken?: string;
        role?: string;
        isFirstTimeLogin?: string;
        permissions?: string[];
        accessTokenExpiry?: number;
        emailVerified?: boolean;
        accountStatus:string;
        email:string;
    }
}

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
                portal: { // Add the portal credential
                    label: "Portal",
                    type: "text",
                    hidden: true, // You might want to handle this differently in the UI
                },
               
            },

            async authorize(credentials) {
                if (!credentials) {
                    // console.log("No credentials provided.");
                    return null;
                }

                const { email, password, portal } = credentials;
                try {

                    const res = await fetch(api_endpoints.auth.login ,
                        {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                            portal: portal,
                        }),
                    });

                    const result = await res.json();
                    // console.log("Login response:", result);

                    const user = result.user;


                    if (result.status === "success") {
                      return {
                            id: user.id,
                            accessToken: user.token,
                            role: user.role,
                            permissions: user.permissions,
                            emailVerified:user.emailVerified || false,
                            accountStatus:user.accountStatus || "inactive",
                            email: user.email,
                        };
                    } 
                    else if (result.status === "failure") {
                        throw new Error(result.detail || "Authentication failed");
                    }
                   
                    else {
                        throw new Error(result.detail || "Authentication failed");
                  }
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
    },

    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
           
            if (user) {
                token.id = user.id;
                token.accessToken = user.accessToken;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
                token.emailVerified = !!user.emailVerified;
                console.log("Token ID:", token.id); // Log the token
                token.accountStatus=user.accountStatus || "inactive",
                token.email = user.email
            }
            return token;
        },        
        async session({ session, token }) {
       
            session.id = token.id;
            session.accessToken = token.accessToken;
            session.role = token.role;
            session.emailVerified = token.emailVerified;
            session.accountStatus = token.accountStatus;
            session.email = token.email;
          return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
