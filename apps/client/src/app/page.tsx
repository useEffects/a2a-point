import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";

export default function Home() {
  return <div>
    <ToggleTheme />
    <Button> Hello, World </Button>
  </div>
}