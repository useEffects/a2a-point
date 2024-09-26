import { createError } from "@directus/errors"
import { defineHook } from '@directus/extensions-sdk';

const verificationMissingError = createError("Forbidden", "Your account must have been verified before you can do this process.", 403)

export default defineHook(({ filter }) => {
	filter('items.create', async (payload: Record<string, any>, meta, context) => {
		if (meta.collection !== "listings") return payload
		const user = await context.database("directus_users").where({ id: context.accountability?.user }).first()
		if (user.is_verified) return payload

		throw new verificationMissingError()
	});
});
