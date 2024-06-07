import { useEffect, useState } from "react";
import { View } from "react-native";
import { Dimensions, Image } from "react-native";

interface FullWidthImageProps {
    source: {
        uri: string;
    };
    className?: string
}

const screenWidth = Dimensions.get('window').width;

export const FullWidthImage: React.FC<FullWidthImageProps> = ({ source, className }) => {
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        Image.getSize(source.uri, (width, height) => {
            setImageDimensions({ width, height });
        }, (error) => {
            console.error(`Couldn't get the image size: ${error?.message}`);
        });
    }, [source.uri]);

    if (imageDimensions.width === 0 || imageDimensions.height === 0) {
        return null; // or a loading spinner
    }

    const aspectRatio = imageDimensions.width / imageDimensions.height;

    return <Image
        source={source}
        style={{ width: screenWidth, height: screenWidth / aspectRatio }}
        resizeMode="contain"
        className={className}
    />
};

