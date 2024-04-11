import { useEffect, useState } from "react";
import { Linking } from "react-native";

const useDeepLink = () => {
    const [linkedURL, setLinkedURL] = useState<string | null>(null);

    useEffect(() => {
        const getUrlAsync = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                setLinkedURL(decodeURI(initialUrl));
            }
        };

        getUrlAsync();
    }, []);

    useEffect(() => {
        const callback = ({ url }: { url: string }) => setLinkedURL(decodeURI(url));
        const subscription = Linking.addEventListener('url', callback);
        return () => {
            subscription.remove();
        };
    }, []);

    const resetURL = () => setLinkedURL(null);

    return { linkedURL, resetURL };
};

export default useDeepLink;