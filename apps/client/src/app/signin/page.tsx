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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle, faMicrosoft, faSlack} from '@fortawesome/free-brands-svg-icons';

const items = [
    {
        name: "continue",
        icon: ""
    },
    {
        name: "Sign Up With Google",
        icon: faGoogle
    },
    {
        name: "Sign Up With Microsoft",
        icon: faMicrosoft
    },
    {
        name: "Sign Up With Slack",
        icon: faSlack
    }
];




function SignIn({ setShowLogin }: { setShowLogin: Dispatch<SetStateAction<boolean>> }) {
    return <div className=" flex w-full h-full justify-center ">

        <div className="flex flex-col gap-8 w-full ">
            <div className="flex justify-center mt-20">
                <img src={a2a.src} alt="img" className="w-[185px] h-[78px]"></img>
            </div>
            <div className="flex flex-col px-8 gap-8 ">
                <p className="text-4xl font-medium mt-8">Nice to see you again</p>

                <div className="flex flex-col gap-4 ">
                    <Label htmlFor="email">Work Email </Label>
                    <Input type="email" placeholder="Email or phone number " />
                </div>
                <div className="flex flex-col gap-4 ">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" placeholder="Enter password" />
                </div>

                <p>Forgot Password?</p>
            </div>
            <div className="flex flex-col gap-8">
                {
                    items.map((item, i) => <div key={i} className="flex flex-col items-center">
                        <Button className="p-4 w-full ">{item.name}</Button>
                        <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>

                    </div>
                    )
                }


            </div>
            <div className="flex justify-center gap-8">
                <p>Don't Have an account? <span onClick={() => setShowLogin(false)} >   Sign up now </span></p>

            </div>

        </div>


    </div>
}

function Register({ setShowLogin }: { setShowLogin: Dispatch<SetStateAction<boolean>> }) {
    return <div className="flex w-full">

        <div className="flex flex-col gap-4 w-1/2">
            <div className="flex justify-center mt-20 gap-8">
                <img src={a2a.src} alt="img" className="w-[185px] h-[78px]"></img>
            </div>
            <div className="flex flex-col px-8 gap-8">

                <p className="text-4xl font-medium mt-8">Create account</p>
                <p className="">We recommend  using your work email - it keeps work and life separate</p>
                <div className="flex gap-8">
                    <div className="flex flex-col gap-4 w-1/2 ">
                        <Label htmlFor="name">First name </Label>
                        <Input type="name" placeholder="Enter first name" />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2">
                        <Label htmlFor="name">Last name </Label>
                        <Input type="name" placeholder="Enter last name" />
                    </div>

                </div>
                <div className="flex  gap-4  ">
                    <div className="flex flex-col gap-4 w-1/2 ">
                        <Label htmlFor="email">Email </Label>
                        <Input type="email" placeholder="Enter email" />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2">
                        <Label htmlFor="date">Date of birth(dd/mm/yyyy) </Label>
                        <Input type="date" placeholder="Enter dob" />
                    </div>

                </div>
                <div className="flex  gap-4  ">
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
                    <label htmlFor="terms">I agree to all <span>Terms</span> and <span>Privacy policy</span></label>
                </div>
            </div>
            <div className="flex justify-center gap-8 ">
                <Button className="p-4 w-3/5 ">Create account</Button>
            </div>
            <div className="flex justify-center gap-8">
                <p>Have an account? <span onClick={() => setShowLogin(true)} >   Login now </span></p>

            </div>

        </div>

    </div >
}



export default function Home() {
    const [showLogin, setShowLogin] = useState(false)
    return <div className="container p-4 flex gap-4 items-center">
        <img src={component1.src} alt="img" className="w-full object-contain"></img>
        {showLogin ? <SignIn setShowLogin={setShowLogin} /> : <Register setShowLogin={setShowLogin} />}

    </div>
}