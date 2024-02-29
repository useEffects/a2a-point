"use client"
import { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import component1 from "@/assests/Component 1.png"
import a2a from "@/assests/a2a.png"
import { Button } from "@/components/ui/button"
import { ToggleTheme } from "@/components/toggle-theme";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"






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
                    <div className="flex flex-col gap-4 w-1/2 ">
                        <Label htmlFor="name">First name </Label>
                        <Input type="name" placeholder="Enter first name" />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2">
                        <Label htmlFor="name">Last name </Label>
                        <Input type="name" placeholder="Enter last name" />
                    </div>

                </div>
                <div className="flex w-full gap-8  ">
                    <div className="flex flex-col gap-4 w-1/2 ">
                        <Label htmlFor="email">Email </Label>
                        <Input type="email" placeholder="Enter email" />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2">
                        <Label htmlFor="date">Date of birth(dd/mm/yyyy) </Label>
                        <Input type="date" placeholder="Enter dob" />
                    </div>

                </div>
                <div className="flex w-full gap-8  ">
                    <div className="flex flex-col gap-4 w-1/2 ">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" placeholder="Enter password" />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2 ">
                        <Label htmlFor="password">Confirm password </Label>
                        <Input type="password" placeholder="Enter password again" />

                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label htmlFor="terms">I agree to all <span className="text-orange-500">Terms</span> and <span className="text-orange-500" >Privacy policy</span></label>
                </div>
            </div>
            <div className="flex justify-center "> 
                <Button className="p-4 w-3/5 bg-orange-500">Create account</Button>
            </div>
            <div className="flex justify-center gap-2">
                <p>Have an account? <span onClick={() => setShowRegistration(false)} className="text-orange-500">   Login now </span></p>

            </div>

        </div>

    </div >
}



export default function Home() {
    const [showRegistration, setShowRegistration] = useState(false)
    return <div className="container p-4">
        {showRegistration ? <SignIn /> : <Register setShowRegistration={setShowRegistration} />}

    </div>
}