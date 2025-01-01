import { useState, useEffect, FC } from 'react';
import { Image, ImageProps, ImageURISource } from 'react-native';

export type AsyncImageSourceType = (
  | Omit<ImageURISource, 'uri'>
  | Omit<ImageURISource, 'uri'>[]
) & {
  uri?: string | Promise<string>;
};

interface AsyncImageProps extends Omit<ImageProps, 'source'> {
  source: AsyncImageSourceType;
}

export const AsyncImage: FC<AsyncImageProps> = ({ source, ...props }) => {
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);

  useEffect(() => {
    const resolveSource = async () => {
      if (
        source?.uri &&
        typeof (source.uri as Promise<string>).then === 'function'
      ) {
        try {
          const uri = await source.uri;
          setResolvedUri(uri);
        } catch (error) {
          console.error('Failed to load async URI:', error);
        }
      } else if (source?.uri) {
        setResolvedUri(source.uri as string);
      }
    };

    resolveSource();
  }, [source]);

  return (
    resolvedUri && (
      <Image
        {...props}
        source={
          typeof source === 'object'
            ? { ...source, uri: resolvedUri }
            : { uri: resolvedUri }
        }
      />
    )
  );
};
