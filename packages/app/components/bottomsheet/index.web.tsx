import { Dispatch, ReactNode, SetStateAction } from "react";
import { Sheet, SheetContent, SheetTitle } from "../ui/web/sheet";
import { Separator } from "../ui/separator";
import { useIsSmallDevice } from "app/hooks/is-small-device";

export default function BottomSheet(props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, onBackdropPress: () => void, children: ReactNode }) {
    const isSmallDevice = useIsSmallDevice();

    return (
        <Sheet open={props.open} onOpenChange={props.setOpen}>
            <SheetTitle />
            <SheetContent side={isSmallDevice ? "bottom" : "left"} className="bg-card !border-0">
                {isSmallDevice ? (
                    <div className="flex flex-col gap-4">
                        <Separator />
                        {props.children}
                    </div>
                ) : (
                    <div className="flex">
                        {props.children}
                        <Separator orientation="vertical" className="h-screen" />
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
