"use client";

import { getSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { signInPathForRole } from "@/utils/auth";

const SignOut = () => {

    useEffect(() => {
        const redirectToSignIn = async () => {
            const session = await getSession();
            signOut({
                callbackUrl: signInPathForRole(session?.role),
                redirect: true,
            });
        };

        redirectToSignIn();
    }, []);

    return null;
};

export default SignOut;
