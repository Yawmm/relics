import client from "@/apollo-client";
import {gql} from "@apollo/client";
import {ProjectFilter} from "@/components/App/Dialogs/Projects/FilterProjectDialog";
import {CORE_TASK_FIELDS} from "@/lib/tasks";

const CORE_PROJECT_FIELDS = gql`
	fragment CoreProjectFields on Project {
		id
		name
		description
		owner {
			userId
			username
			email
		}
		tags {
			id
			name
			color
		}
		categories {
			id
			name
		}
		links {
			id
			name
			owner {
				userId
				username
				email
			},
			members {
				userId
				username
				email
			}
		}
	}
`;

export const GET_PROJECT_QUERY = gql`
	${CORE_PROJECT_FIELDS}
	${CORE_TASK_FIELDS}
	query Project($id: ID!) {
		project(project: $id) {
			...CoreProjectFields
			members {
				userId
				username
				email
			}
			invites {
				userId
				username
				email
			}
			categories {
				id
				name
				tasks {
					...CoreTaskFields
				}
			}
			tasks {
				...CoreTaskFields
			}
		}
	}
`;

export const GET_PROJECT_FILTER_QUERY = gql`
	${CORE_PROJECT_FIELDS}
	${CORE_TASK_FIELDS}
	query Project($id: ID!, $tags: [UUID]) {
		project(project: $id) {
			...CoreProjectFields
			members {
				userId
				username
				email
			}
			invites {
				userId
				username
				email
			}
			categories {
				id
				name
				tasks(where: { tags: { some: { id: { in: $tags }}}}) {
					...CoreTaskFields
				}
			}
			tasks(where: { tags: { some: { id: { in: $tags }}}}) {
				...CoreTaskFields
			}
		}
	}
`;

export const GET_PROJECTS_QUERY = gql`
	${CORE_PROJECT_FIELDS}
	${CORE_TASK_FIELDS}
	query Projects($userId: ID!) {
		projects(user: $userId) {
			...CoreProjectFields
			categories {
				id
				name
				tasks {
					...CoreTaskFields
				}
			}
			tasks {
				...CoreTaskFields
			}
		}
	}
`;

export const PROJECT_SUBSCRIPTION = gql`
	${CORE_PROJECT_FIELDS}
	${CORE_TASK_FIELDS}
	subscription ProjectSubscription($id: ID!) {
		project(project: $id) {
			type,
			project {
				...CoreProjectFields
				members {
					userId
					username
					email
				}
				invites {
					userId
					username
					email
				}
				categories {
					id
					name
					tasks {
						...CoreTaskFields
					}
				}
				tasks {
					...CoreTaskFields
				}
			}
		}
	}
`;

export const PROJECT_FILTER_SUBSCRIPTION = gql`
	${CORE_PROJECT_FIELDS}
	${CORE_TASK_FIELDS}
	subscription ProjectSubscription($id: ID!, $tags: [UUID]) {
		project(project: $id) {
			type,
			project {
				...CoreProjectFields
				members {
					userId
					username
					email
				}
				invites {
					userId
					username
					email
				}
				categories {
					id
					name
					tasks(where: { tags: { some: { id: { in: $tags }}}}) {
						...CoreTaskFields
					}
				}
				tasks(where: { tags: { some: { id: { in: $tags }}}}) {
					...CoreTaskFields
				}
			}
		}
	}
`;

export const PROJECTS_SUBSCRIPTION = gql`
	${CORE_PROJECT_FIELDS}
	subscription ProjectsSubscription($userId: ID!) {
		userProjects(user: $userId) {
			type,
			project {
				...CoreProjectFields
			}
		}
	}
`;

export async function sendProjectInvite(
	id: string,
	email: string,
) {
	return client.mutate({
		mutation: gql`
		mutation SendProjectInvitation($id: ID!, $email: String!) {
			sendProjectInvitation(input: {project: $id, user: $email}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
					... on ProjectDuplicateMemberError {
						message
					}
					... on ProjectDuplicateInviteError {
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

export async function revokeProjectInvite(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation RevokeProjectInvitation($id: ID!, $user: ID!) {
			revokeProjectInvitation(input: {user: $user, project: $id}) {
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

export async function acceptProjectInvite(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation AcceptProjectInvitation($id: ID!, $user: ID!) {
			acceptProjectInvitation(input: {user: $user, project: $id}) {
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

export async function declineProjectInvite(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation DeclineProjectInvitation($id: ID!, $user: ID!) {
			declineProjectInvitation(input: {user: $user, project: $id}) {
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

export async function kickProjectMember(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation KickProjectMember($id: ID!, $user: ID!) {
			kickProjectMember(input: {user: $user, project: $id}) {
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

export async function leaveProject(
	id: string,
	user: string,
) {
	return client.mutate({
		mutation: gql`
		mutation LeaveProject($id: ID!, $user: ID!) {
			leaveProject(input: {user: $user, project: $id}) {
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

export async function linkTeam(
	team: string,
	project: string
) {
	return client.mutate({
		mutation: gql`
		mutation AddProjectLink($team: ID!, $project: ID!) {
			addProjectLink(input: {team: $team, project: $project}) {
				result {
					success
				}
			}
		}
		`,
		variables: {
			team,
			project
		}
	});
}

export async function unlinkTeam(
	team: string,
	project: string
) {
	return client.mutate({
		mutation: gql`
		mutation RemoveProjectLink($team: ID!, $project: ID!) {
			removeProjectLink(input: {team: $team, project: $project}) {
				result {
					success
				}
			}
		}
		`,
		variables: {
			team,
			project
		}
	});
}

export async function addProject(
	name: string,
	description: string,
	owner: string
) {
	return client.mutate({
		mutation: gql`
        mutation AddProject($name: String!, $description: String!, $owner: ID!) {
			addProject(input: {name: $name, description: $description, owner: $owner}) {
				uuid
			}
		}
       `,
		variables: {
			name,
			description,
			owner
		}
	});
}

export async function editProject(
	project: string,
	name?: string,
	description?: string,
	owner?: string
) {
	return client.mutate({
		mutation: gql`
		mutation UpdateProject($project: ID!, $name: String, $description: String, $owner: ID) {
		    updateProject(
		        input: {project: $project, name: $name, description: $description, owner: $owner}
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
			project,
			name,
			description,
			owner
		}
	});
}

export async function removeProject(
	project: string
) {
	return client.mutate({
		mutation: gql`
        mutation RemoveProject($project: ID!) {
			removeProject(input: {project: $project}) {
				result {
					success
				}
			}
		}
      `,
		variables: {
			project
		}
	});
}

export async function addCategory(
	name: string,
	project: string
	) {
	return client.mutate({
		mutation: gql`
        mutation AddCategory($name: String!, $project: ID!) {
			addCategory(input: {name: $name, project: $project}) {
				uuid
			}
		}
      `,
		variables: {
			name,
			project
		}
	});
}

export async function editCategory(
	category: string,
	name?: string
) {
	return client.mutate({
		mutation: gql`
        mutation UpdateCategory($category: ID!, $name: String) {
		    updateCategory(input: {category: $category, name: $name}) {
		        result {
		            success
		        }
		    }
		}
      `,
		variables: {
			category,
			name
		}
	});
}

export async function removeCategory(
	category: string
) {
	return client.mutate({
		mutation: gql`
        mutation RemoveCategory($category: ID!) {
			removeCategory(input: {category: $category}) {
				result {
					success
				}
			}
		}
      `,
		variables: {
			category
		}
	});
}