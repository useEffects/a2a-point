import { readItem } from "@directus/sdk"
import { Company, FullUser, Listing, User } from "app/lib/types"
import directusStore from "app/store/directus"
import { PDFDocument, PDFForm, StandardFonts } from 'pdf-lib'
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
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const form = pdfDoc.getForm();

    const setField = (form: PDFForm, field: string, value: string | null | undefined) => {
        if (value !== "" && !value) return
        const textField = form.getTextField(field)
        textField.setText(value)
        textField.enableReadOnly()
        textField.setFontSize(8)
        textField.updateAppearances(helvetica)
    }

    setField(form, "date", new Date().toLocaleDateString())

    const listingTitle = splitSentence(listing.title, 2)
    const listingDescription = splitSentence(listing.description, 6)

    console.log(listingTitle)


    if (agent.company) {
        const addressBuyer = splitSentence(agent.company.address, 4)

        setField(form, "establishmentNameBuyer", agent.company.title)
        setField(form, "address1Buyer", addressBuyer[0])
        setField(form, "address2Buyer", addressBuyer[1])
        setField(form, "address3Buyer", addressBuyer[2])
        setField(form, "address4Buyer", addressBuyer[3])
        setField(form, "phoneBuyer", agent.company.phone)
        setField(form, "faxBuyer", agent.company.fax)
        setField(form, "emailBuyer", agent.company.email)
        setField(form, "ornBuyer", agent.company.ORN)
        setField(form, "dedBuyer", agent.company.DED_LISC)
    }
    setField(form, "agentNameBuyer", agent.first_name + " " + agent.last_name)
    setField(form, "agentBrnBuyer", agent.BRN)
    setField(form, "agentPhoneBuyer", agent.phone)
    setField(form, "agentIssuedOnBuyer", null)
    setField(form, "agentEmailBuyer", agent.email)

    if (receiver.company) {
        const addressSeller = splitSentence(receiver.company.address, 4)

        setField(form, "establishmentNameSeller", receiver.company.title)
        setField(form, "address1Seller", addressSeller[0])
        setField(form, "address2Seller", addressSeller[1])
        setField(form, "address3Seller", addressSeller[2])
        setField(form, "address4Seller", addressSeller[3])
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

    setField(form, "listingTitle1", listingTitle[0])
    setField(form, "listingTitle2", listingTitle[1])
    setField(form, "listingPrice", listing.budget.toString())
    // setField(form, "listingAddress", listing.lo)
    setField(form, "listingDescription1", listingDescription[0])
    setField(form, "listingDescription2", listingDescription[1])
    setField(form, "listingDescription3", listingDescription[2])
    setField(form, "listingDescription4", listingDescription[3])
    setField(form, "listingDescription5", listingDescription[4])
    setField(form, "listingDescription6", listingDescription[5])
    setField(form, "listingBedrooms", listing.bedrooms?.toString())
    setField(form, "listingBathrooms", listing.bathrooms?.toString())
    setField(form, "listingGarage", listing.parking?.toString())

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

function splitSentence(sentence: string, size: number) {
    const maxLength = 40; // Maximum length for each chunk
    const words = sentence.split(' ');
    const result = [];
    let currentChunk = '';

    for (const word of words) {
        // Check if adding the next word exceeds maxLength
        if (currentChunk.length + word.length + (currentChunk ? 1 : 0) > maxLength) {
            // Store the current chunk and start a new one
            result.push(currentChunk.trim());
            currentChunk = word; // Start new chunk with the current word
        } else {
            // Append the word to the current chunk
            currentChunk += (currentChunk ? ' ' : '') + word;
        }
    }

    // Add the last chunk if there's any remaining text
    if (currentChunk) {
        result.push(currentChunk.trim());
    }

    // If the number of chunks is more than the size, truncate the result
    return result.slice(0, size);
}

export const dynamic = "force-dynamic";