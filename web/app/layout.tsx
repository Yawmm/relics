"use client"

import './globals.css'
import { Inter } from 'next/font/google'
import React, {useCallback, useEffect} from "react";
import {ApolloProvider} from "@apollo/client";
import client from "@/apollo-client";
import {useUser} from "@/lib/hooks";
import HomeHeader from "@/components/Home/HomeHeader";
import {usePathname, useRouter} from "next/navigation";
import AppFooter from "@/components/App/AppFooter";
import Loader from "@/components/Login/Loader";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { loading, authentication } = useUser();
    const { push } = useRouter();

    const path = usePathname();
    const isApp = useCallback(() => path.startsWith("/app"), [path]);

    useEffect(() => {
        if (isApp() && !(authentication.isLoggedIn || loading || (authentication.expiration && authentication.expiration > Date.now()))) {
            push("/sign-in")
        }
    }, [authentication.isLoggedIn, loading])

    return (
        <html lang="en" className={"flex flex-col min-h-screen"}>
            <body className={inter.className + " flex flex-col min-h-screen"}>
                <ApolloProvider client={client}>
                    <main className={`flex flex-col flex-grow w-full h-full bg-zinc-800
                        selection:bg-main-500`
                    }>
                        {isApp()
                            ? !authentication.isLoggedIn || loading
                                ? (
                                    <div className={"flex flex-grow w-full min-h-full justify-center items-center px-[var(--gutter-x-margin)]"}>
                                        <Loader />
                                    </div>
                                ) : (
                                    <div className={"flex flex-grow py-[var(--gutter-y-margin)]"}>
                                        {children}
                                    </div>
                                )
                            : (
                                <>
                                    <HomeHeader />
                                    <div className={"pb-[var(--gutter-y-margin)] pt-[calc(var(--gutter-y-margin)/2)]"}>
                                        {children}
                                    </div>
                                </>
                            )
                        }
                    </main>
                    {(isApp() && authentication?.isLoggedIn) && <AppFooter />}
                </ApolloProvider>
            </body>
        </html>
    )
}
