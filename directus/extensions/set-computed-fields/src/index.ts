import { defineHook } from '@directus/extensions-sdk';
import { Knex } from 'knex';

export default defineHook(({ filter, action }, { services, getSchema }) => {
	action('items.create', async (meta, context) => {
		if (meta.collection === "feedbacks") {
			const { ItemsService } = services;
			const usersService = new ItemsService("directus_users", {
				...context,
				schema: await getSchema(),
				accountability: context.accountability
			})
			await setComputedRating(usersService, "create", context.database, meta.payload.agent, meta.payload.rating);
		}
	});
	filter("items.delete", async (payload: string[], meta, context): Promise<string[]> => {
		if (meta.collection === "feedbacks") {
			const { ItemsService } = services;
			const usersService = new ItemsService("directus_users", {
				...context,
				schema: await getSchema(),
				accountability: context.accountability
			});

			const deletionPromises = payload.map(async (id: string) => {
				const feedback = await context.database("feedbacks").where({ id }).first();
				await setComputedRating(usersService, "delete", context.database, feedback.agent, feedback.rating);
				return id
			});
			return Promise.all(deletionPromises);
		} else {
			return payload;
		}

	});
});

async function setComputedRating(usersService: any, mode: "create" | "update" | "delete", database: Knex<any, any[]>, userId: string, newRating?: number) {
	const feedbacksCount = await database("feedbacks").count("* as count").where({ agent: userId }).first().then(res => res?.count as number);

	const user = await usersService.readOne(userId);
	const { computed_rating } = user
	let _newRating = null

	if (mode === "create") {
		_newRating = calculateNewAverage(computed_rating || 0, feedbacksCount || 0, newRating!)
	} else if (mode === "delete") {
		_newRating = calculateNewAverageRemoval(computed_rating || 0, feedbacksCount || 0, newRating!)
	}

	await usersService.updateOne(userId, {
		computed_rating: _newRating
	})
}

function calculateNewAverage(oldAvg: number, newCount: number, newNumber: number) {
	return (((newCount - 1) * oldAvg + newNumber)) / (newCount);
}

function calculateNewAverageRemoval(oldAvg: number, oldCount: number, newNumber: number) {
	if (oldCount <= 1) return null
	return ((oldAvg * oldCount) - newNumber) / (oldCount - 1);
}