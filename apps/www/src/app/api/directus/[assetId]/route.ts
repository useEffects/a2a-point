import { directusToken, directusUrl } from "src/lib/constants";

export async function GET(request: Request, { params: { assetId } }: { params: { assetId: string } }) {
    try {
        const response = await fetch(`${directusUrl}/assets/${assetId}/?access_token=${directusToken}`);

        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        const blob = await response.blob();

        // Create a new Response object with the blob as body
        const imageResponse = new Response(blob);

        // Set the content type header for the response
        imageResponse.headers.set('Content-Type', response.headers.get('Content-Type') || "application/octet-stream");

        return imageResponse;
    } catch (error) {
        console.error('Error fetching the image:', error);
        // Return an error response
        return new Response('Failed to fetch image', { status: 500 });
    }
}
