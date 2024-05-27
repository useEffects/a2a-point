import { readItem } from "@directus/sdk"
import { Listing, User } from "app/lib/types"
import { PDFDocument, PDFForm } from 'pdf-lib'
import { getFormData } from "src/lib/a2a-form"
import { directus } from "src/lib/directus"

export const GET = async (req: Request, { params: { id } }: { params: { id: string } }) => {
    const data = await directus.request(readItem("forms", id, {
        fields: ["*.*"]
    })) as {
        id: string,
        user_created: User,
        receiver: User,
        name: string,
        listing: Listing
    }
    const { user_created: agent, receiver, name, listing } = data
    const formData = await getFormData();
    const pdfDoc = await PDFDocument.load(formData)
    const form = pdfDoc.getForm();
    const fields = form.getFields()
    fields.forEach(f => console.log(f.getName()))

    setField(form, "date", new Date().toLocaleDateString())

    setField(form, "establishmentNameBuyer", null)
    setField(form, "addressBuyer", null)
    setField(form, "phoneBuyer", null)
    setField(form, "faxBuyer", null)
    setField(form, "emailBuyer", null)
    setField(form, "ornBuyer", null)
    setField(form, "dedBuyer", null)
    setField(form, "agentNameBuyer", agent.first_name + " " + agent.last_name)
    setField(form, "agentBrnBuyer", null)
    setField(form, "agentIssuedOnBuyer", null)
    setField(form, "agentPhoneBuyer", null)
    setField(form, "agentEmailBuyer", agent.email)

    setField(form, "establishmentNameSeller", null)
    setField(form, "addressSeller", null)
    setField(form, "phoneSeller", null)
    setField(form, "faxSeller", null)
    setField(form, "emailSeller", null)
    setField(form, "ornSeller", null)
    setField(form, "dedSeller", null)
    setField(form, "agentNameSeller", receiver.first_name + " " + receiver.last_name)
    setField(form, "agentBrnSeller", null)
    setField(form, "agentIssuedOnSeller", null)
    setField(form, "agentPhoneSeller", null)
    setField(form, "agentEmailSeller", receiver.email)

    setField(form, "listingTitle", listing.title)
    setField(form, "listingPrice", listing.price.toString())
    setField(form, "listingAddress", listing.address)
    setField(form, "listingDescription", listing.description)
    setField(form, "listingBedrooms", listing.bedrooms.toString())
    setField(form, "listingBathrooms", listing.bathrooms.toString())
    setField(form, "listingGarage", listing.garages.toString())
    setField(form, "listingFloors", listing.floors.toString())

    setField(form, "commissionSellerAgent", null)
    setField(form, "commissionBuyerAgent", null)
    setField(form, "commissionBuyerName", null)

    setField(form, "signatureAgentA", null)
    setField(form, "signatureAgentB", null)


    const savedPdf = await pdfDoc.save()
    const pdfBlob = new Blob([savedPdf], { type: 'application/pdf' });

    const response = new Response(pdfBlob);
    response.headers.set('Content-Disposition', 'attachment; filename="filename.pdf"');
    response.headers.set('Content-Type', 'application/pdf');

    return response
}

const setField = (form: PDFForm, field: string, value: string | null) => {
    const textField = form.getTextField(field)
    textField.setText(value ?? "N / A")
    textField.enableReadOnly()
}

export const dynamic = "force-dynamic";