"use client"

import { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import component1 from "@/assests/Component 1.png"
import a2a from "@/assests/a2a.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import * as validUrl from "valid-url"
import { signIn, useSession } from 'next-auth/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

const DisplayingErrorMessagesSchema = Yup.object().shape({

    name: Yup.string().min(3).required("Please enter your name."),
    lname: Yup.string().min(3).required("Please enter your last name."),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().matches(passwordRegex, "Please enter valid password.").required("Please enter your password."),
    cpassword: Yup.string().oneOf([Yup.ref("password")], "Password do NOT match!").required("Please enter confirm password."),
    date: Yup.date().required("Please enter your dob"),

});

const items = [
    {
        name: "Sign Up With Google",
        icon: faGoogle
    },
    {
        name: "Sign Up With Microsoft",
        icon: faMicrosoft
    }
];

function SignIn({ setShowLogin }: { setShowLogin: Dispatch<SetStateAction<boolean>> }) {
    const { data: session } = useSession()
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        const resp = await signIn("credentials", { ...form, redirect: true })
        console.log(resp)
        if (!resp?.error) {
            toast.success("Login successful")
        } else {
            if (resp.status === 401) {
                toast.error("Either email or password is incorrect")
            } else {
                toast.error("Something went wrong, please contact admin")
            }
        }
        setLoading(false)
    }
    return <div className="flex max-w-md flex-col gap-4 xl:gap-8 lg:justify-between h-full">
        <img src={a2a.src} alt="img" className="mx-auto w-[185px] h-[78px]"></img>
        <p className="text-4xl font-medium">Nice to see you again</p>
        <div className="flex flex-col gap-2">
            <Formik initialValues={{

                email: '',

                password: '',

            }}

                validationSchema={DisplayingErrorMessagesSchema}

                onSubmit={values => {

                    console.log(values);

                }}>
                {({ errors, touched }) => (

                    <Form>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="email">Work Email </Label>
                            <Field type="email" name="email" placeholder="Email or phone number " />
                            {touched.email && errors.email && <div>{errors.email}</div>}
                            <Label htmlFor="password">Password</Label>
                            <Field type="password" name="password" placeholder="Enter password" />
                            {errors.password && touched.password && <div>{errors.password}</div>}
                        </div>

                    </Form>

                )}
            </Formik>
            <p className="text-right text-sm">Forgot Password?</p>
        </div>
        {loading ? <Button disabled className="flex gap-4"> <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Please Wait </Button> : <Button onClick={(e) => { e.preventDefault(); handleSubmit() }}>Continue</Button>}
        <div className="flex flex-col gap-2 items-center w-full">
            {items.map((item, i) => <Button key={i} className="flex gap-2 w-full"> <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon> {item.name}</Button>)}
        </div>
        <p>Don't Have an account? <span onClick={() => setShowLogin(false)} >   Sign up now </span></p>
    </div>
}

function Register({ setShowLogin }: { setShowLogin: Dispatch<SetStateAction<boolean>> }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
    const [accept, setAccept] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)
        fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                password: form.password
            })
        }).then(res => {
            console.log(res)
            if (res.status === 201) {
                const redirectUrl = searchParams.get("redirect")
                if (redirectUrl) {
                    const redirect = () => router.push(redirectUrl)
                    const data = validUrl.isUri(redirectUrl) ? {
                        description: "You will be redirected shortly",
                        action: {
                            label: "Redirect now",
                            onClick: redirect
                        },
                        onDismiss: redirect,

                    } : undefined
                    toast.success("User registration successful", data)
                }
            }
        }).catch((e) => {
            console.log(e)
        }).finally(() => {
            setLoading(false)
        })
    }

    return <div className="flex max-w-md flex-col gap-4 xl:gap-8 lg:justify-between h-full">
        <img src={a2a.src} alt="img" className="w-[185px] h-[78px] mx-auto"></img>
        <div>
            <p className="text-4xl font-medium">Create account</p>
            <p className="text-muted-foreground">We recommend  using your work email - it keeps work and life separate</p>
        </div>
        <div className="flex flex-col gap-2">
            <Formik initialValues={{
  
                name:'',
                lname:'',
                email: '',
                password: '',
                cpassword:'',
                date:'',
            }}

                validationSchema={DisplayingErrorMessagesSchema}

                onSubmit={values => {

                    console.log(values);

                }}>
                {({ errors, touched }) => (

                    <Form className="flex flex-col  gap-4">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label htmlFor="name">First name </Label>
                                <Field type="name" name="name" placeholder="Enter first name" />
                                {touched.name && errors.name && <div>{errors.name}</div>}
                            </div>
                            <div className="w-1/2">
                                <Label htmlFor="lname">Last name </Label>
                                <Field type="name" name="lname" placeholder="Enter last name" />
                                {touched.lname && errors.lname && <div>{errors.lname}</div>}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label htmlFor="email">Email </Label>
                                <Field type="email" name="email" placeholder="Enter email" />
                                {touched.email && errors.email && <div>{errors.email}</div>}
                            </div>
                            <div className="w-1/2">
                                <Label htmlFor="date">Date of birth(dd/mm/yyyy) </Label>
                                <Field type="date" name="date" placeholder="Enter dob" />
                                {touched.date && errors.date && <div>{errors.date}</div>}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label htmlFor="password">Password</Label>
                                <Field type="password" name="password" placeholder="Enter password" />
                                {touched.password && errors.password && <div>{errors.password}</div>}
                            </div>
                            <div className="w-1/2">
                                <Label htmlFor="cpassword">Confirm password </Label>
                                <Field type="password" name="cpassword" placeholder="Enter password again" />
                                {touched.cpassword && errors.cpassword && <div>{errors.cpassword}</div>}
                            </div>
                        </div>
                    </Form>

                )}
            </Formik>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
            </div>
            <div className="flex items-center space-x-2" onClick={() => setAccept(!accept)}>
                <Checkbox checked={accept} id="terms" />
                <Label htmlFor="terms">I agree to all <a href="">Terms</a> and <a href="">Privacy policy</a></Label>
            </div>
        </div>
        {loading ? <Button disabled className="flex gap-4 mx-auto w-4/5"> <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Please Wait </Button> : <Button className="w-4/5 mx-auto" onClick={handleSubmit}>Create account</Button>}
        <p className="text-center">Have an account? <span onClick={() => setShowLogin(true)}> Login now </span></p>
    </div >
}

export default function Home() {
    const [showLogin, setShowLogin] = useState(true)
    return <div className="w-full min-h-screen flex justify-center items-center">
        <div className="container p-4 flex gap-4 justify-between items-center">
            <div className="w-1/2 h-full">
                <img src={component1.src} alt="img" className="w-full object-contain"></img>
            </div>
            <div className="w-1/2 flex justify-center h-full">
                {showLogin ? <SignIn setShowLogin={setShowLogin} /> : <Register setShowLogin={setShowLogin} />}
            </div>
        </div>
    </div>
}