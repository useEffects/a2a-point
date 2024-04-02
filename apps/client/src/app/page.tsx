import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const colors = [
  {
    bg: "background",
    text: "foreground"
  }
]

export default function Home() {
  return <div>
    <ToggleTheme />
    <Button> Hello, World </Button>
    <div className="w-screen flex justify-center">
      <div className="container">
        {colors.map(({bg, text}, key) => <div key={key} className={cn("w-20, h-20 rounded flex justify-center items-center", bg)}>
          <p className={cn("text-center", text)}> {text} </p>
        </div>)}
      </div>
    </div>
  </div>
}