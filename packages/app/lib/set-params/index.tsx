import useNavigation from "app/hooks/navigation"

export const useSetParams = () => {
    const navigation = useNavigation()

    const setParams = (key: string, value: any) => {
        navigation.setParams({ [key]: value })
    }

    return setParams
}