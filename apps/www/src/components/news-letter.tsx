import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Text } from "src/components/ui/text"

export const NewsLetter = () => {
    return <div className="container flex justify-center items-center gap-4">
        <div className="flex flex-col gap-8 w-1/2">
            <p className="text-3xl md:text-5xl font-bold"> Stay in the <span className="text-primary"> loop </span> </p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur officiis ipsa ea, voluptas dicta aut excepturi! Sit eius asperiores necessitatibus reiciendis doloribus tempora atque, quas totam, earum libero, perferendis repudiandae?</p>
        </div>
        <div className="w-1/2 flex justify-center">
            <div className="flex gap-4">
                <Input className="max-w-sm" placeholder="Email" />
                <Button>
                    <Text>Subscribe</Text>
                </Button>
            </div>
        </div>
    </div>
}