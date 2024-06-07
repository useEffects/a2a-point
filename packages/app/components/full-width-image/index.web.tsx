export const FullWidthImage = ({ source, className = "" }: { source: { uri: string }, className?: string }) => {
    return <img src={source.uri} alt="Full width image" style={{ width: "100%" }} className={className} />
}