import { readItem } from "@directus/sdk"
import { Company, FullUser, Listing, User } from "app/lib/types"
import directusStore from "app/store/directus"
import { PDFDocument, PDFForm } from 'pdf-lib'
import { getFormData } from "src/lib/a2a-form"

export const GET = async (req: Request, { params: { id } }: { params: { id: string } }) => {
    const { rest } = directusStore.getState()
    const data = await rest.request(readItem("forms", id, {
        fields: ["*.*.*"]
    })) as {
        id: string,
        user_created: Omit<User, "company"> & { company: Company | null },
        receiver: Omit<User, "company"> & { company: Company | null },
        name: string,
        listing: Listing,
        commission_buyer: number,
        commission_seller: number,
        client_name: string
    }
    const { user_created: agent, receiver, name, listing, commission_buyer, commission_seller, client_name } = data
    const formData = await getFormData();
    const pdfDoc = await PDFDocument.load(formData)
    const form = pdfDoc.getForm();

    setField(form, "date", new Date().toLocaleDateString())

    if (agent.company) {
        setField(form, "establishmentNameBuyer", agent.company.title)
        setField(form, "addressBuyer", agent.company.address)
        setField(form, "phoneBuyer", agent.company.phone)
        setField(form, "faxBuyer", agent.company.fax)
        setField(form, "emailBuyer", agent.company.email)
        setField(form, "ornBuyer", agent.company.ORN)
        setField(form, "dedBuyer", agent.company.DED_LISC)
        setField(form, "agentPhoneBuyer", agent.company.phone)
    }
    setField(form, "agentNameBuyer", agent.first_name + " " + agent.last_name)
    setField(form, "agentBrnBuyer", agent.BRN)
    setField(form, "agentIssuedOnBuyer", null)
    setField(form, "agentEmailBuyer", agent.email)

    if (receiver.company) {
        setField(form, "establishmentNameSeller", receiver.company.title)
        setField(form, "addressSeller", receiver.company.address)
        setField(form, "phoneSeller", receiver.company.phone)
        setField(form, "faxSeller", receiver.company.fax)
        setField(form, "emailSeller", receiver.company.email)
        setField(form, "ornSeller", receiver.company.ORN)
        setField(form, "dedSeller", receiver.company.DED_LISC)
    }
    setField(form, "agentNameSeller", receiver.first_name + " " + receiver.last_name)
    setField(form, "agentBrnSeller", receiver.BRN)
    setField(form, "agentIssuedOnSeller", null)
    setField(form, "agentPhoneSeller", receiver.phone)
    setField(form, "agentEmailSeller", receiver.email)

    setField(form, "listingTitle", name)
    setField(form, "listingPrice", listing.price.toString())
    setField(form, "listingAddress", listing.address)
    setField(form, "listingDescription", listing.description)
    setField(form, "listingBedrooms", listing.bedrooms?.toString())
    setField(form, "listingBathrooms", listing.bathrooms?.toString())
    setField(form, "listingGarage", listing.garages?.toString())
    setField(form, "listingFloors", listing.floors?.toString())

    setField(form, "commissionSellerAgent", commission_seller.toString())
    setField(form, "commissionBuyerAgent", commission_buyer.toString())
    setField(form, "commissionBuyerName", client_name)

    setField(form, "signatureAgentA", null)
    setField(form, "signatureAgentB", null)


    const savedPdf = await pdfDoc.save()
    const pdfBlob = new Blob([savedPdf], { type: 'application/pdf' });

    const response = new Response(pdfBlob);
    response.headers.set('Content-Disposition', 'attachment; filename="filename.pdf"');
    response.headers.set('Content-Type', 'application/pdf');

    return response
}

const setField = (form: PDFForm, field: string, value: string | null | undefined) => {
    if (!value) return
    const textField = form.getTextField(field)
    textField.setText(value)
    textField.enableReadOnly()
}

export const dynamic = "force-dynamic";