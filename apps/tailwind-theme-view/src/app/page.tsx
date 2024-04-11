import { cn } from "@/lib/utils";
import { ThemeToggler } from "@/components/theme-toggler";

const colors = [
  {
    bg: "bg-background",
    text: "text-foreground"
  },
  {
    bg: "bg-card",
    text: "text-card-foreground"
  },
  {
    bg: "bg-popover",
    text: "text-popover-foreground"
  },
  {
    bg: "bg-primary",
    text: "text-primary-foreground"
  },
  {
    bg: "bg-secondary",
    text: "text-secondary-foreground"
  },
  {
    bg: "bg-muted",
    text: "text-muted-foreground"
  },
  {
    bg: "bg-accent",
    text: "text-accent-foreground"
  },
  {
    bg: "bg-destructive",
    text: "text-destructive-foreground"
  },
  {
    bg: "bg-warning",
    text: "text-warning-foreground"
  },
  {
    bg: "bg-info",
    text: "text-info-foreground"
  },
  {
    bg: "bg-success",
    text: "text-success-foreground"
  }
];

export default function Home() {
  return <div className="container w-screen flex justify-center p-12">
    <div className="container gap-4 flex flex-col">
      <div className="w-full flex justify-between items-center">
        <p>A2A theme config</p>
        <ThemeToggler />
      </div>
      <hr />
      <div className="grid gap-4 grid-cols-4">
        {colors.map(({bg, text}, key) => <div className={cn("w-40 h-40 flex justify-center items-center", bg, text)} key={key}>
          <p className="text-center"> {text} </p>
        </div>)}
      </div>
    </div>

  </div>
}
