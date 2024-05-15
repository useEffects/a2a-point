import { directus } from "@/lib/directus"
import { readItem } from "@directus/sdk"
import { PDFDocument } from 'pdf-lib'
import { getFormData } from "@/lib/a2a-form"
import { shortDate } from "@/lib/utils"

const fields: string[] = [
    "establishmentNameBuyer",
    "addressBuyer",
    "phoneBuyer",
    "faxBuyer",
    "emailBuyer",
    "ornBuyer",
    "dedBuyer",
    "agentNameBuyer",
    "agentBrnBuyer",
    "agentIssuedOnBuyer",
    "agentPhoneBuyer",
    "agentEmailBuyer",
    "establishmentNameSeller",
    "addressSeller",
    "phoneSeller",
    "faxSeller",
    "emailSeller",
    "ornSeller",
    "dedSeller",
    "agentNameSeller",
    "agentBrnSeller",
    "agentIssuedOnSeller",
    "agentPhoneSeller",
    "agentEmailSeller"
];

export const GET = async (req: Request, { params: { id } }: { params: { id: string } }) => {
    const data = await directus.request(readItem("forms", id, {
        fields: ["*.*"]
    }))
    const formData = await getFormData();
    const pdfDoc = await PDFDocument.load(formData)
    const form = pdfDoc.getForm();
    const fields = form.getFields()
    form.getTextField("date").setText(shortDate(new Date().toISOString()))
    form.getTextField("date").enableReadOnly()
    const savedPdf = await pdfDoc.save()
    const pdfBlob = new Blob([savedPdf], { type: 'application/pdf' });

    const response = new Response(pdfBlob);
    response.headers.set('Content-Disposition', 'attachment; filename="filename.pdf"');
    response.headers.set('Content-Type', 'application/pdf');

    return response;
}