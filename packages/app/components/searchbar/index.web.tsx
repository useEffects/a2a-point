import { SearchBarProps } from "@rneui/base";
import { Dispatch, SetStateAction } from "react";
import { Input } from "app/components/ui/input";
import { Search } from "lucide-react-native";

export default function SearchBar({ searchText, setSearchText, searchBarProps }: { searchText: string, setSearchText: Dispatch<SetStateAction<string>>, searchBarProps?: SearchBarProps }) {
    return <div className="flex-grow flex flex-row gap-4 items-center relative">
        <Search size={24} className="text-primary absolute left-2" />
        <Input
            value={searchText}
            onChangeText={setSearchText}
            className="flex-grow rounded-full h-[36px] pl-10"
        />
    </div>
}