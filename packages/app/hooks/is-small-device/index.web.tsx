import { useMediaQuery } from 'usehooks-ts'

export const useIsSmallDevice = () => {
    return useMediaQuery('(max-width: 768px)')
}