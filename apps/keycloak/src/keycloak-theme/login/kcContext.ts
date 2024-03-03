import { createGetKcContext } from "keycloakify/login";

export type KcContextExtension =
	| { pageId: "login.ftl";  }
	| { pageId: "my-extra-page-1.ftl"; }
	| { pageId: "my-extra-page-2.ftl"; someCustomValue: string; }
	// NOTE: register.ftl is deprecated in favor of register-user-profile.ftl
	// but let's say we use it anyway and have this plugin enabled: https://github.com/micedre/keycloak-mail-whitelisting
	// keycloak-mail-whitelisting define the non standard ftl global authorizedMailDomains, we declare it here.
	| { pageId: "register.ftl"; authorizedMailDomains: string[]; };

//NOTE: In most of the cases you do not need to overload the KcContext, you can 
// just call createGetKcContext(...) without type arguments.  
// You want to overload the KcContext only if:  
// - You have custom plugins that add some values to the context (like https://github.com/micedre/keycloak-mail-whitelisting that adds authorizedMailDomains)
// - You want to add support for extra pages that are not yey featured by default, see: https://docs.keycloakify.dev/contributing#adding-support-for-a-new-page
export const { getKcContext } = createGetKcContext<KcContextExtension>();

export const { kcContext } = getKcContext({
	// Uncomment to test the login page for development.
	mockPageId: "login.ftl",
});


export type KcContext = NonNullable<ReturnType<typeof getKcContext>["kcContext"]>;