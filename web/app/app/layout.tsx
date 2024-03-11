"use client";

import React, {useEffect} from "react";
import {useUser} from "@/lib/hooks";
import HomeHeader from "@/components/Home/HomeHeader";
import {useRouter} from "next/navigation";
import AppFooter from "@/components/App/AppFooter";
import Loader from "@/components/Login/Loader";
import client from "@/apollo-client";
import {ApolloProvider} from "@apollo/client";

export default function AppLayout({ children }: {
	children: React.ReactNode
}) {
	const { loading, authentication } = useUser();
	const { push } = useRouter();

	useEffect(() => {
		if (!(authentication.isLoggedIn || loading || (authentication.expiration && authentication.expiration > Date.now()))) {
			push("/sign-in");
		}
	}, [authentication.isLoggedIn, loading]);

	return (
		<ApolloProvider client={client}>
			<main className={"flex flex-col flex-grow w-full h-full"}>
				{!authentication.isLoggedIn || loading ? (
					<main className={"absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center"}>
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
			</main>
		</ApolloProvider>
	);
}
