"use client"

import {useEffect, useState} from "react";
import {CookieValueTypes, deleteCookie, getCookie, getCookies, setCookie} from "cookies-next";
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
		let base64Url = raw.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		let body = decodeURIComponent(window
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
			let parsedToken = parseToken(token);
			let id = parsedToken.sub;

			if (user.user?.id === id)
				return;

			try {
				let { data } = await client.query<{ user: User }>({
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
					})
				}
				return;
			} catch {
				await deleteCookie("token")
				await push("/sign-in")
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
			})
		}
	}

	useEffect(() => {
		let token = getCookie("token");
		updateUser(token)
	}, [getCookies()])

	return user
}