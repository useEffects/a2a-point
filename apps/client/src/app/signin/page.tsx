"use client"
import { useState } from "react"
import component1 from "@/assests/Component 1.png"
import a2a from "@/assests/a2a.png"
import { Button } from "@/components/ui/button"
import { ToggleTheme } from "@/components/toggle-theme";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu"

function SignIn() {
    return <div className=" flex w-full ">


    </div>
}

function Register() {
    return <div className="flex w-full">
        <div className="w-1/2 m-4" >
            <img src={component1.src} alt="img"></img>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex justify-center mt-20">
                <img src={a2a.src} alt="img" className="w-[185px] h-[78px]"></img>
            </div>
            <p className="text-4xl font-medium mt-8">Create account</p>
            <p className="">We recommend  using your work email - it keeps work and life separate</p>
            <div className="flex w-full gap-8  ">
                <div className="flex flex-col gap-1 w-1/2 ">
                    <p>First name</p>
                    <input className=""></input>
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                    <p>Last name</p>
                    <input className=""></input>
                </div>

            </div>
            <div className="flex w-full gap-8  ">
                <div className="flex flex-col gap-1 w-1/2 ">
                    <p>Email or Phone number</p>
                    <input className=""></input>
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                    <p>Date of birth(dd/mm/yyyy)</p>
                    <input className=""></input>
                </div>

            </div>
            <div className="flex w-full gap-8  ">
                <div className="flex flex-col gap-1 w-1/2 ">
                    <p>password</p>
                    <input className=""></input>
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                    <p>Confirm password</p>
                    <input className=""></input>
                </div>

            </div>
            

        </div>

    </div>
}



export default function Home() {
    <ToggleTheme />
    const [back, setBack] = useState(false)
    return back ? <SignIn /> : <Register />
}