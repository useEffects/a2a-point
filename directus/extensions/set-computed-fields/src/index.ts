import { defineHook } from '@directus/extensions-sdk';
import { Knex } from 'knex';

export default defineHook(({ filter }) => {
	filter('items.create', async (_payload, meta, context) => {
		if (meta.collection === "feedbacks") {
			const payload = _payload as { rating: number, agent: string };
			await setComputedRating("create", context.database, payload.agent, payload.rating);
		}
		return _payload;
	});
	filter("items.delete", async (_payload, meta, context) => {
		if (meta.collection === "feedbacks") {
			const payload = _payload as string[];

			const deletionPromises = payload.map(async (id: string) => {
				const feedback = await context.database("feedbacks").where({ id }).first();
				await setComputedRating("delete", context.database, feedback.agent, feedback.rating);
				return id
			});
			await Promise.all(deletionPromises);
		}
		return _payload;
	});
	filter("items.update", async (_payload, meta, context) => {
		if (meta.collection === "feedbacks") {
			const payload = _payload as { rating?: number };
			if (!payload.rating) return;

			const feedback = await context.database("feedbacks").where({ id: meta.keys[0] }).first();
			await setComputedRating("update", context.database, feedback.agent, payload.rating);
		}
		return _payload;
	})
});

async function setComputedRating(mode: "create" | "update" | "delete", database: Knex<any, any[]>, userId: string, newRating?: number) {
	const feedbacksCount = await database("feedbacks").count("* as count").where({ agent: userId }).first().then(res => res?.count as number);

	const user = await database("directus_users").where({ id: userId }).first();
	console.log(user)
	const { computed_rating } = user
	let _newRating = null

	if (mode === "create") {
		_newRating = calculateNewAverage(computed_rating || 0, feedbacksCount || 0, newRating!)
	} else if (mode === "delete") {
		_newRating = calculateNewAverageRemoval(computed_rating || 0, feedbacksCount || 0, newRating!)
	} else if (mode === "update") {
		if (feedbacksCount <= 1) {
			_newRating = newRating
		} else {
			_newRating = calculateNewAverageRemoval(computed_rating || 0, feedbacksCount || 0, newRating!)
			_newRating = calculateNewAverage(_newRating, (feedbacksCount - 1) || 0, newRating!)
		}
	}
	await database("directus_users").where({ id: userId }).update({ computed_rating: _newRating });
}

function calculateNewAverage(avg: number | null, count: number, num: number): number {
	if (avg === null) return num
	return ((count * avg) + num) / (count + 1);
}

function calculateNewAverageRemoval(avg: number, count: number, num: number): number | null {
	if (count <= 1) return null
	return ((avg * count) - num) / (count - 1);
}