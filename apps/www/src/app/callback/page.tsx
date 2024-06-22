"use client"

import { UserChip } from "app/components/user-chip";
import { useUserDetails } from "app/hooks/user-details";
import { products } from "app/lib/constants";
import { Divide } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Stripe from "stripe";

export default function CallbackPage() {
    const params = useSearchParams()
    const session_id = params.get('session_id')
    const [session, setSession] = useState<Stripe.Response<Stripe.Checkout.Session>>()
    const [redirectingIn, setRedirectingIn] = useState(10)
    const router = useRouter()

    useEffect(() => {
        if (session_id) {
            fetch(`/api/stripe-session/${session_id}`).then(res => {
                if (res.status === 200) {
                    res.json().then(setSession)
                } else {
                    router.push("/")
                }
            })
        }
        const timer = setInterval(() => {
            setRedirectingIn(p => p - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect((() => {
        if (redirectingIn === 0) {
            router.push("/")
        }
    }), [redirectingIn])

    return (
        <div className="container p-4 mx-auto">
            {session && <div className="flex flex-col gap-4">
                <CallbackComponent session={session} />
                <p>Redirecting in <span className="text-info">{redirectingIn}</span> seconds</p>
            </div>}
        </div>
    );
}

const CallbackComponent = ({ session }: { session: Stripe.Response<Stripe.Checkout.Session> }) => {
    const params = useSearchParams()
    const isMobile = !!params.get('isMobile')

    const { priceCode, userId } = session.metadata!
    const user = useUserDetails(userId)
    const product = products.find(p => p.stripeCode === priceCode)

    return user && (
        <div className="flex flex-col gap-4 max-w-sm items-start bg-card border border-border rounded p-4">
            <UserChip user={user!} />
            <p>
                Your membership plan, {product?.productType} has been bought successfully
            </p>
            {isMobile && <p>
                If you are using our mobile app, please close this window and <span className="text-destructive underline">reopen</span> the app to see changes
            </p>}
        </div>
    );
}