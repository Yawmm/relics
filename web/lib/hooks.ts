"use client";

import {useEffect, useState} from "react";
import {CookieValueTypes, deleteCookie, getCookie, getCookies} from "cookies-next";
import {User} from "@/lib/types";
import {useRouter} from "next/navigation";
import client from "@/apollo-client";
import {GET_USER_QUERY} from "@/lib/users";

export type UserData = {
	loading: boolean,
	authentication: {
		isLoggedIn: boolean | null,
		expiration: number | null,
		token: {
			raw: string
			value: any
		} | null
	},
	user: User | null
}

export const useUser = () => {
	const { push } = useRouter();

	const [user, setUser] = useState<UserData>({
		loading: true,
		authentication: {
			isLoggedIn: null,
			expiration: null,
			token: null
		},
		user: null
	} as UserData);

	function parseToken(raw: string) {
		const base64Url = raw.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const body = decodeURIComponent(window
			.atob(base64)
			.split('')
			.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join('')
		);

		return JSON.parse(body);
	}

	async function updateUser(token: CookieValueTypes) {
		if (typeof token === "string")
		{
			const parsedToken = parseToken(token);
			const id = parsedToken.sub;

			if (user.user?.id === id)
				return;

			try {
				const { data } = await client.query<{ user: User }>({
					query: GET_USER_QUERY,
					variables: {
						id: id
					}
				});
				
				if (data) {
					setUser({
						loading: false,
						authentication: {
							isLoggedIn: true,
							expiration: parsedToken.exp,
							token: {
								raw: token,
								value: parsedToken
							}
						},
						user: data.user
					});
				}
				return;
			} catch {
				deleteCookie("token");
				push("/sign-in");
			}
		} else if (user.loading || user.authentication.isLoggedIn) {
			setUser({
				loading: false,
				authentication: {
					isLoggedIn: false,
					expiration: null,
					token: null
				},
				user: null
			});
		}
	}

	useEffect(() => {
		const token = getCookie("token");
		(async () => await updateUser(token))();
	}, [getCookies()]);

	return user;
};