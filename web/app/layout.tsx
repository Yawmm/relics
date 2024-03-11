"use client";

import './globals.css';
import {Inter} from 'next/font/google';
import React from "react";
import {ApolloProvider} from "@apollo/client";
import client from "@/apollo-client";
import HomeHeader from "@/components/Home/HomeHeader";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={"flex flex-col min-h-screen"}>
            <body className={inter.className + " flex flex-col min-h-screen bg-zinc-800 selection:bg-zinc-500"}>
                <ApolloProvider client={client}>
                    <main className={"flex flex-col flex-grow w-full h-full"}>
                        <HomeHeader/>

                        <div className={"flex flex-grow w-full"}>
                            {children}
                        </div>
                    </main>
                </ApolloProvider>
            </body>
        </html>
    );
}
