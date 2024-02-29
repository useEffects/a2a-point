"use client"
import { Dispatch, SetStateAction} from "react"
import { useState } from "react"
import component1 from "@/assests/Component 1.png"
import a2a from "@/assests/a2a.png"
import { Button } from "@/components/ui/button"
import { ToggleTheme } from "@/components/toggle-theme";
import { Input } from "@/components/ui/input"




function SignIn() {
    return <div className=" flex w-full ">


    </div>
}

function Register({ setShowRegistration }: { setShowRegistration: Dispatch<SetStateAction<boolean>> }) {
    return <div className="flex w-full">
        <div className="w-1/2 m-2 h-full" >
            <img src={component1.src} alt="img" className="w-full object-contain"></img>
        </div>
        <div className="flex flex-col gap-8 w-1/2">
            <div className="flex justify-center mt-20">
                <img src={a2a.src} alt="img" className="w-[185px] h-[78px]"></img>
            </div>
            <div className="flex flex-col px-8 gap-8">

                <p className="text-4xl font-medium mt-8">Create account</p>
                <p className="">We recommend  using your work email - it keeps work and life separate</p>
                <div className="flex w-full gap-8">
                    <div className="flex flex-col gap-1 w-1/2 ">
                        <p>First name</p>
                        <Input />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <p>Last name</p>
                        <Input />
                    </div>

                </div>
                <div className="flex w-full gap-8  ">
                    <div className="flex flex-col gap-1 w-1/2 ">
                        <p>Email or Phone number</p>
                        <Input />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <p>Date of birth(dd/mm/yyyy)</p>
                        <Input />
                    </div>

                </div>
                <div className="flex w-full gap-8  ">
                    <div className="flex flex-col gap-1 w-1/2 ">
                        <p>Password</p>
                        <Input />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <p>Confirm password</p>
                        <Input />

                    </div>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" />
                    <label>Remember me</label>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" />
                    <label>I agree to all <span >Terms</span> and <span>Privacy policy</span></label>
                </div>
            </div>
            <Button className="">Create account</Button>
            <div className="flex justify-center gap-2">
                <p>Have an account? <span onClick={() => setShowRegistration(false)} > Login now </span></p>

        </div>

    </div>

    </div >
}



export default function Home() {
    const [showRegistration, setShowRegistration] = useState(false)
    return showRegistration ? <SignIn /> : <Register setShowRegistration={setShowRegistration} />
}