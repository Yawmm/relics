"use client";

import './globals.css';
import {Inter} from 'next/font/google';
import React, {useCallback, useEffect} from "react";
import {ApolloProvider} from "@apollo/client";
import client from "@/apollo-client";
import {useUser} from "@/lib/hooks";
import HomeHeader from "@/components/Home/HomeHeader";
import {usePathname, useRouter} from "next/navigation";
import AppFooter from "@/components/App/AppFooter";
import Loader from "@/components/Login/Loader";

const inter = Inter({ subsets: ['latin'] });

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
            push("/sign-in");
        }
    }, [authentication.isLoggedIn, loading]);

    return (
        <html lang="en" className={"flex flex-col min-h-screen"}>
            <body className={inter.className + " flex flex-col min-h-screen bg-zinc-800 selection:bg-zinc-500"}>
            <ApolloProvider client={client}>
                {isApp() ? (
                    <>
                        {!authentication.isLoggedIn || loading ? (
                            <main className={"flex flex-grow w-full min-h-full justify-center items-center "}>
                                <Loader/>
                            </main>
                        ) : (
                            <main className={"inline-flex flex-col flex-grow w-full h-full"}>
                                <HomeHeader/>
                                <div className={"inline-flex flex-row w-full overscroll-contain"}>
                                    <div className={"hidden lg:flex sticky left-0 bottom-0"}>
                                        <AppFooter/>
                                    </div>
                                    <div className={"flex max-w-[100vw] md:w-full max-h-[calc(100vh-132px)] overflow-y-scroll overscroll-contain"}>
                                        {children}
                                    </div>
                                </div>
                            </main>
                        )}
                        {authentication.isLoggedIn && (
                            <div className={"sticky bottom-0 lg:hidden"}>
                                <AppFooter/>
                            </div>
                        )}
                    </>
                ) : (
                    <main className={"flex flex-col flex-grow w-full h-full"}>
                        <HomeHeader/>

                        <div className={"flex flex-grow w-full"}>
                            {children}
                        </div>
                    </main>
                )}
            </ApolloProvider>
            </body>
        </html>
    );
}
