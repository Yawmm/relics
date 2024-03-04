import client from "@/apollo-client";
import {gql} from "@apollo/client";

export const CORE_TASK_FIELDS = gql`
	fragment CoreTaskFields on Task {
		id
			name
			description
			isFinished
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
			comments {
				id
				content
				timestamp
				owner {
					userId
					username
					email
				}
			}
	}
`;

export const GET_TASKS_QUERY = gql`
	${CORE_TASK_FIELDS}
	query Tasks($id: ID!) {
		tasks(user: $id) {
			...CoreTaskFields
		}
	}
`;

export const TASKS_SUBSCRIPTION = gql`
	${CORE_TASK_FIELDS}
	subscription TasksSubscription($id: ID!) {
		userTasks(user: $id) {
			type,
			task {
				...CoreTaskFields
			}
		}
	}
`;

export async function addTask(
	name: string,
	description: string,
	finished: boolean,
	owner: string,
	project: string,
	category?: string,
) {
	return client.mutate({
		mutation: gql`
        mutation AddTask($name: String!, $description: String!, $finished: Boolean!, $category: ID, $owner: ID!, $project: ID!) {
			addTask(input: {name: $name, description: $description, finished: $finished, category: $category, owner: $owner, project: $project}) {
				uuid
			}
		}
      `,
		variables: {
			name,
			description,
			finished,
			owner,
			project,
			category
		}
	});
}

export async function editTask(
	task: string,
	edit: {
		name?: string,
		description?: string,
		isFinished?: boolean,
		categoryId?: string | null,
	}
) {
	return client.mutate({
		mutation: gql`
		mutation UpdateTask($task: ID!, $category: ID, $name: String, $description: String, $isFinished: Boolean) {
		    updateTask(
		        input: {task: $task, category: $category, name: $name, description: $description, finished: $isFinished}
		    ) {
		        result {
		            success
		        }
		    }
		}
		`,
		variables: {
			task,
			category: edit.categoryId,
			name: edit.name,
			description: edit.description,
			isFinished: edit.isFinished
		}
	});
}

export async function addComment(
	content: string,
	task: string,
	owner: string
) {
	return client.mutate({
		mutation: gql`
        mutation AddComment($content: String!, $task: ID!, $owner: ID!) {
			addComment(input: {content: $content, task: $task, owner: $owner}) {
				uuid
			}
		}
      `,
		variables: {
			content,
			task,
			owner,
		}
	});
}

export async function removeComment(
	comment: string
) {
	await client.mutate({
		mutation: gql`
        mutation RemoveComment($comment: ID!) {
			removeComment(input: {comment: $comment}) {
				result {
					success
				}
			}
		}
      `,
		variables: {
			comment
		}
	});
}

export async function removeTask(
	task: string
) {
	await client.mutate({
		mutation: gql`
        mutation RemoveTask($task: ID!) {
			removeTask(input: {task: $task}) {
				result {
					success
				}
			}
		}
      `,
		variables: {
			task
		}
	});
}