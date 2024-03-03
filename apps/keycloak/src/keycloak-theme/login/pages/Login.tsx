import { useState, type FormEventHandler } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const my_custom_param = new URL(window.location.href).searchParams.get("my_custom_param");

if (my_custom_param !== null) {
    console.log("my_custom_param:", my_custom_param);
}

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(e => {
        e.preventDefault();

        setIsLoginButtonDisabled(true);

        const formElement = e.target as HTMLFormElement;

        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

        formElement.submit();
    });

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={
                realm.password &&
                realm.registrationAllowed &&
                !registrationDisabled
            }
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg("doLogIn")}
            infoNode={
                <div className="flex justify-between mt-4">
                    <span>
                        {msg("noAccount")}
                    </span>
                    <a className="hover:!text-primary hover:!no-underline" tabIndex={6} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </a>
                </div>
            }
        >
            <div id="kc-form" className={clsx(realm.password && social.providers !== undefined && getClassName("kcContentWrapperClass"))}>
                <div
                    id="kc-form-wrapper"
                    className={clsx(
                        realm.password &&
                        social.providers && [getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass")]
                    )}
                >
                    {realm.password && (
                        <form id="kc-form-login" className="flex flex-col gap-2" onSubmit={onSubmit} action={url.loginAction} method="post">
                            <div className={getClassName("kcFormGroupClass")}>
                                {!usernameHidden &&
                                    (() => {
                                        const label = !realm.loginWithEmailAllowed
                                            ? "username"
                                            : realm.registrationEmailAsUsername
                                                ? "email"
                                                : "usernameOrEmail";

                                        const autoCompleteHelper: typeof label = label === "usernameOrEmail" ? "username" : label;

                                        return (
                                            <>
                                                <Label htmlFor={autoCompleteHelper} className={getClassName("kcLabelClass")}>
                                                    {msg(label)}
                                                </Label>
                                                <Input
                                                    tabIndex={1}
                                                    id={autoCompleteHelper}
                                                    className={getClassName("kcInputClass")}
                                                    //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                                    //the browser how to pre fill the form but before submit we put it back
                                                    //to username because it is what keycloak expects.
                                                    name={autoCompleteHelper}
                                                    defaultValue={login.username ?? ""}
                                                    type="text"
                                                    autoFocus={true}
                                                    autoComplete="off"
                                                />
                                            </>
                                        );
                                    })()}
                            </div>
                            <div className={getClassName("kcFormGroupClass")}>
                                <Label htmlFor="password" className={getClassName("kcLabelClass")}>
                                    {msg("password")}
                                </Label>
                                <Input
                                    tabIndex={2}
                                    id="password"
                                    className={getClassName("kcInputClass")}
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                tabIndex={3}
                                                id="rememberMe"
                                                name="rememberMe"
                                                {...(login.rememberMe === "on"
                                                    ? {
                                                        "checked": true
                                                    }
                                                    : {})}
                                            />
                                            <Label className="translate-y-[2px]" htmlFor="rememberMe">
                                                {msg("rememberMe")}
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <div className={getClassName("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a className="!text-muted-foreground hover:!text-foreground hover:!no-underline" tabIndex={5} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="hidden"
                                    id="id-hidden-input"
                                    name="credentialId"
                                    {...(auth?.selectedCredential !== undefined
                                        ? {
                                            "value": auth.selectedCredential
                                        }
                                        : {})}
                                />
                                <Button disabled={isLoginButtonDisabled} type="submit" tabIndex={4}> {msgStr("doLogIn")} </Button>
                            </div>
                        </form>
                    )}
                </div>
                <hr className="bg-foreground my-4" />
                {realm.password && social.providers !== undefined && (
                    <>
                        {/*<div
                            id="kc-social-providers"
                            className={clsx(getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass"))}
                        >
                            <ul
                                className={clsx(
                                    getClassName("kcFormSocialAccountListClass"),
                                    social.providers.length > 4 && getClassName("kcFormSocialAccountDoubleListClass")
                                )}
                            >
                                {social.providers.map(p => (
                                    <li key={p.providerId} className={getClassName("kcFormSocialAccountListLinkClass")}>
                                        <a href={p.loginUrl} id={`zocial-${p.alias}`} className={clsx("zocial", p.providerId)}>
                                            <span>{p.displayName}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div> */}
                        <div className="w-full">
                            {social.providers.map(p => <a className="w-full" key={p.providerId} href={p.loginUrl}>
                                <Button className="!w-full my-1" tabIndex={7}>
                                    {p.displayName}
                                </Button>
                            </a>)}
                        </div>
                    </>
                )}
            </div>
        </Template>
    );
}
