import client from "@/apollo-client";
import {gql} from "@apollo/client";

export async function addTag(
	name: string,
	color: string,
	project: string,
) {
	return client.mutate({
		mutation: gql`
        mutation AddTag($name: String!, $color: String!, $project: ID!) {
			addTag(input: {name: $name, color: $color, project: $project}) {
				uuid
			}
		}
      `,
		variables: {
			name,
			color,
			project
		}
	});
}

export async function editTag(
	tag: string,
	edit: {
		name?: string,
		color?: string,
		tasks?: [{ type: "ADD" | "REMOVE", task: string }]
	}
) {
	return client.mutate({
		mutation: gql`
		mutation UpdateTag($tag: ID!, $name: String, $color: String, $tasks: [LabelChangeInput!]) {
		    updateTag(
		        input: {tag: $tag, name: $name, color: $color, tasks: $tasks}
		    ) {
		        result {
		            success
		        }
		    }
		}
		`,
		variables: {
			tag,
			name: edit.name,
			color: edit.color,
			tasks: edit.tasks
		}
	});
}

export async function removeTag(
	tag: string
) {
	await client.mutate({
		mutation: gql`
        mutation RemoveTag($tag: ID!) {
			removeTag(input: {tag: $tag}) {
				result {
					success
				}
			}
		}
      `,
		variables: {
			tag
		}
	});
}