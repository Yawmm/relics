import client from "@/apollo-client";
import {gql} from "@apollo/client";

const CORE_TEAM_FIELDS = gql`
	fragment CoreTeamFields on Team {
		id
		name
		owner {
			userId,
			username,
			email
		}
		members {
			userId,
			username,
			email
		}
	}
`;

export const GET_TEAMS_QUERY = gql`
	${CORE_TEAM_FIELDS}
	query Teams($id: ID!) {
		teams(user: $id) {
			...CoreTeamFields
			invites {
				userId,
				username,
				email
			}
		}
	}
`;

export const TEAMS_SUBSCRIPTION = gql`
	${CORE_TEAM_FIELDS}
	subscription TeamsSubscription($userId: ID!) {
		userTeams(user: $userId) {
			type,
			team {
				...CoreTeamFields
				invites {
					userId,
					username,
					email
				}
			}
		}
	}
`;

export async function addTeam(
	name: string,
	owner: string
) {
	return client.mutate({
		mutation: gql`
        mutation AddTeam($name: String!, $owner: ID!) {
			addTeam(input: {name: $name, owner: $owner}) {
				uuid
			}
		}
       `,
		variables: {
			name,
			owner
		}
	});
}

export async function sendTeamInvite(
	id: string,
	email: string,
) {
	return client.mutate({
		mutation: gql`
		mutation SendTeamInvitation($id: ID!, $email: String!) {
			sendTeamInvitation(input: {team: $id, user: $email}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
					... on TeamDuplicateMemberError {
						message
					}
					... on TeamDuplicateInviteError {
						message
					}
				}
			}
		}
		`,
		variables: {
			id,
			email
		}
	});
}

export async function revokeTeamInvite(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation RevokeTeamInvitation($id: ID!, $user: ID!) {
			revokeTeamInvitation(input: {team: $id, user: $user}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
				}
			}
		}
		`,
		variables: {
			id,
			user
		}
	});
}

export async function acceptTeamInvite(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation AcceptTeamInvitation($id: ID!, $user: ID!) {
			acceptTeamInvitation(input: {team: $id, user: $user}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
				}
			}
		}
		`,
		variables: {
			id,
			user
		}
	});
}

export async function declineTeamInvite(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation DeclineTeamInvitation($id: ID!, $user: ID!) {
			declineTeamInvitation(input: {team: $id, user: $user}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
				}
			}
		}
		`,
		variables: {
			id,
			user
		}
	});
}

export async function kickTeamMember(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation KickTeamMember($id: ID!, $user: ID!) {
			kickTeamMember(input: {team: $id, user: $user}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
				}
			}
		}
		`,
		variables: {
			id,
			user
		}
	});
}


export async function leaveTeam(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
        mutation LeaveTeam($id: ID!, $user: ID!) {
			leaveTeam(input: {team: $id, user: $user}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
				}
			}
		}
      `,
		variables: {
			id,
			user
		}
	});
}

export async function editTeam(
	team: string,
	name?: string,
	owner?: string
) {
	return client.mutate({
		mutation: gql`
		mutation UpdateTeam($team: ID!, $name: String, $owner: ID) {
		    updateTeam(
		        input: {team: $team, name: $name, owner: $owner}
		    ) {
		        result {
		            success
		        }
		        errors {
		            ... on ItemNotFoundError {
		                message
		            }
		        }
		    }
		}
		`,
		variables: {
			team,
			name,
			owner
		}
	});
}

export async function removeTeam(
	team: string
) {
	return client.mutate({
		mutation: gql`
        mutation RemoveTeam($team: ID!) {
			removeTeam(input: {team: $team}) {
				result {
					success
				}
			}
		}
      `,
		variables: {
			team
		}
	});
}