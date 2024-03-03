// ejected using 'npx eject-keycloak-page'
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, register, realm, passwordRequired, recaptchaRequired, recaptchaSiteKey } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} headerNode={msg("registerTitle")}>
            <form id="kc-register-form" className="flex flex-col gap-2" action={url.registrationAction} method="post">
                <div
                    className={clsx(
                        getClassName("kcFormGroupClass"),
                        messagesPerField.printIfExists("firstName", getClassName("kcFormGroupErrorClass"))
                    )}
                >
                    <div className={getClassName("kcLabelWrapperClass")}>
                        <Label htmlFor="firstName" className={getClassName("kcLabelClass")}>
                            {msg("firstName")}
                        </Label>
                    </div>
                    <div className={getClassName("kcInputWrapperClass")}>
                        <Input
                            type="text"
                            id="firstName"
                            className={getClassName("kcInputClass")}
                            name="firstName"
                            defaultValue={register.formData.firstName ?? ""}
                        />
                    </div>
                </div>

                <div
                    className={clsx(
                        getClassName("kcFormGroupClass"),
                        messagesPerField.printIfExists("lastName", getClassName("kcFormGroupErrorClass"))
                    )}
                >
                    <div className={getClassName("kcLabelWrapperClass")}>
                        <Label htmlFor="lastName" className={getClassName("kcLabelClass")}>
                            {msg("lastName")}
                        </Label>
                    </div>
                    <div className={getClassName("kcInputWrapperClass")}>
                        <Input
                            type="text"
                            id="lastName"
                            className={getClassName("kcInputClass")}
                            name="lastName"
                            defaultValue={register.formData.lastName ?? ""}
                        />
                    </div>
                </div>
                <div
                    className={clsx(getClassName("kcFormGroupClass"), messagesPerField.printIfExists("email", getClassName("kcFormGroupErrorClass")))}
                >
                    <div className={getClassName("kcLabelWrapperClass")}>
                        <Label htmlFor="email" className={getClassName("kcLabelClass")}>
                            {msg("email")}
                        </Label>
                    </div>
                    <div className={getClassName("kcInputWrapperClass")}>
                        <Input
                            type="text"
                            id="email"
                            className={getClassName("kcInputClass")}
                            name="email"
                            defaultValue={register.formData.email ?? ""}
                            autoComplete="email"
                        />
                    </div>
                </div>
                {!realm.registrationEmailAsUsername && (
                    <div
                        className={clsx(
                            getClassName("kcFormGroupClass"),
                            messagesPerField.printIfExists("username", getClassName("kcFormGroupErrorClass"))
                        )}
                    >
                        <div className={getClassName("kcLabelWrapperClass")}>
                            <Label htmlFor="username" className={getClassName("kcLabelClass")}>
                                {msg("username")}
                            </Label>
                        </div>
                        <div className={getClassName("kcInputWrapperClass")}>
                            <Input
                                type="text"
                                id="username"
                                className={getClassName("kcInputClass")}
                                name="username"
                                defaultValue={register.formData.username ?? ""}
                                autoComplete="username"
                            />
                        </div>
                    </div>
                )}
                {passwordRequired && (
                    <>
                        <div
                            className={clsx(
                                getClassName("kcFormGroupClass"),
                                messagesPerField.printIfExists("password", getClassName("kcFormGroupErrorClass"))
                            )}
                        >
                            <div className={getClassName("kcLabelWrapperClass")}>
                                <Label htmlFor="password" className={getClassName("kcLabelClass")}>
                                    {msg("password")}
                                </Label>
                            </div>
                            <div className={getClassName("kcInputWrapperClass")}>
                                <Input
                                    type="password"
                                    id="password"
                                    className={getClassName("kcInputClass")}
                                    name="password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div
                            className={clsx(
                                getClassName("kcFormGroupClass"),
                                messagesPerField.printIfExists("password-confirm", getClassName("kcFormGroupErrorClass"))
                            )}
                        >
                            <div className={getClassName("kcLabelWrapperClass")}>
                                <Label htmlFor="password-confirm" className={getClassName("kcLabelClass")}>
                                    {msg("passwordConfirm")}
                                </Label>
                            </div>
                            <div className={getClassName("kcInputWrapperClass")}>
                                <Input type="password" id="password-confirm" className={getClassName("kcInputClass")} name="password-confirm" />
                            </div>
                        </div>
                    </>
                )}
                {recaptchaRequired && (
                    <div className="form-group">
                        <div className={getClassName("kcInputWrapperClass")}>
                            <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey}></div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <div id="kc-form-options" className={getClassName("kcFormOptionsClass")}>
                        <div className={getClassName("kcFormOptionsWrapperClass")}>
                            <span>
                                <a className="text-muted-foreground hover:text-foreground" href={url.loginUrl}>{msg("backToLogin")}</a>
                            </span>
                        </div>
                    </div>
                    <div id="kc-form-buttons" className={getClassName("kcFormButtonsClass")}>
                        <Button
                            className="w-full"
                            type="submit"
                            value={msgStr("doRegister")}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </form>
        </Template>
    );
}
