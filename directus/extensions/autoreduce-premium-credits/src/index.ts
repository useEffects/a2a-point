import { defineHook } from '@directus/extensions-sdk';

export default defineHook(({ filter }) => {
	filter('items.create', async (payload, meta, context) => {
		if(meta.collection !== "listings") return payload
		const user = await context.database("directus_users").where({ id: context.accountability?.user }).first()
		console.log(user)
		return payload
	});
	filter('items.update', async (payload, meta, context) => {
		if(meta.collection !== "listings") return payload
		const user = await context.database("directus_users").where({ id: context.accountability?.user }).first()
		console.log(user)
		return payload
	});
	
});
