import client from "@/apollo-client";
import {gql} from "@apollo/client";

export const GET_TASKS_QUERY = gql`
	query Tasks($id: ID!) {
		tasks(user: $id) {
			id
			name
			description
			isFinished
			owner {
				userId
				username
				email
			}
		}
	}
`

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
		isFinished?: boolean
	}
) {
	return client.mutate({
		mutation: gql`
		mutation UpdateTask($task: ID!, $name: String, $description: String, $isFinished: Boolean) {
		    updateTask(
		        input: {task: $task, name: $name, description: $description, finished: $isFinished}
		    ) {
		        result {
		            success
		        }
		    }
		}
		`,
		variables: {
			task,
			name: edit.name,
			description: edit.description,
			isFinished: edit.isFinished
		}
	})
}

export async function removeTask(
	task: string
) {
	const { data } = await client.mutate({
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

	console.log(data)
}