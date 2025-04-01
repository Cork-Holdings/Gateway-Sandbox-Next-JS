
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
        kycStatus?: string;
    }

    interface User {
        id: string;
        accessToken?: string;
        role?: string;
        isFirstTimeLogin?: string;
        permissions?: string[];
        refreshToken?: string;
        kycStatus?: string;
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
        kycStatus?: string;
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
               
            },

            async authorize(credentials) {
                if (!credentials) {
                    console.log("No credentials provided.");
                    return null;
                }

                const { email, password, } = credentials;
               // console.log("Attempting login with email:", email);

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
                        }),
                    });

                    const result = await res.json();
                    console.log("Login response:", result);

                    // Check if the response is successful
                    if (result.status === "success") {
                      //  console.log("Login successful, returning user data.");
                    
                      const user = result.user;
                      
                      return {
                            id: user.id,
                            accessToken: user.token,
                            role: user.role,
                            permissions: user.permissions,
                        };
                    } 
                    // else if (!res.ok || user.status === "failure") {
                    //     console.log("Login failed:", user.message || "Authentication failed");
                    //     throw new Error(user.message || "Authentication failed");
                    // }
                    
                    else {
                        console.log("Login failed:", result.message || "Authentication failed");
                        throw new Error(result.message || "Authentication failed");
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
                token.kycStatus = user.kycStatus;
                console.log("Token ID:", token.id); // Log the token
            }
            return token;
        }
,        

        async session({ session, token }) {
       
            session.id = token.id;
            session.accessToken = token.accessToken;
            session.role = token.role;
            session.kycStatus = token.kycStatus;
          return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
