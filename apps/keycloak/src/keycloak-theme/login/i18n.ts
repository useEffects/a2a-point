import { createUseI18n } from "keycloakify/login";

export const { useI18n } = createUseI18n({
    "en": {
        "doLogIn": "Nice to see you again",
        "doRegister": "Create an account",
        "noAccount": "Don't have an account?",
        "doRegisterNow": "Sign up now",
    }
});

export type I18n = NonNullable<ReturnType<typeof useI18n>>;
