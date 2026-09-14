import React, { useEffect, useState } from 'react';
import { View, Dimensions, Image } from 'react-native';
import { AsyncImage } from '../async-image';
import * as Sentry from '@sentry/react-native';

interface FullWidthImageProps {
  source: {
    uri: string | Promise<string>;
  };
  className?: string;
}

const screenWidth = Dimensions.get('window').width;

export const FullWidthImage: React.FC<FullWidthImageProps> = ({
  source,
  className,
}) => {
  const [imageUri, setImageUri] = useState<string>();
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Resolve the URI if it's a Promise
    const resolveUri = async () => {
      try {
        if (source.uri instanceof Promise) {
          const resolvedUri = await source.uri;
          setImageUri(resolvedUri);
        } else {
          setImageUri(source.uri);
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error resolving image URI:", error);;
      }
    };

    resolveUri();
  }, [source.uri]);

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageDimensions({ width, height });
          setLoading(false);
        },
        (error) => {
          Sentry.captureException(error);
          console.error(`Couldn't get the image size: ${error?.message}`);
          setLoading(false);
        },
      );
    }
  }, [imageUri]);

  if (loading || imageDimensions.width === 0 || imageDimensions.height === 0) {
    return null; // You could return a spinner or placeholder component here
  }

  const aspectRatio = imageDimensions.width / imageDimensions.height;

  return (
    <AsyncImage
      source={{ uri: imageUri }}
      style={{ width: screenWidth, height: screenWidth / aspectRatio }}
      resizeMode="contain"
      className={className}
    />
  );
};
