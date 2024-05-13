import { nextUrl } from "../constants";

async function getFormData(): Promise<ArrayBuffer> {
    try {
        const response = await fetch(nextUrl + '/a2a-form.pdf');
        if (!response.ok) {
            throw new Error('Failed to fetch PDF file');
        }
        
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        return arrayBuffer;
    } catch (error) {
        console.error("Error fetching file:", error);
        throw error;
    }
}

export { getFormData };
