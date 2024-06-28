/* eslint-disable react/no-unescaped-entities */
import { FormInput } from "app/components/formComponents"
import { ArrowUpRight, X } from "app/components/icons"
import { SeparatorText } from "app/components/separator-text"
import { Button } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { useState } from "react"
import { View } from "react-native"
import { Asset, withUri } from "app/components/chat-ui"
import { buildAssetUrl, pickDocuments } from "app/lib/helpers"
import userStore from "app/store/user"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "app/components/ui/card"
import { fileUpload } from "app/lib/file-upload"
import { directusUrl, documentsFolderId } from "app/lib/constants"
import directusStore from "app/store/directus"
import * as Linking from "expo-linking"
import { createItem } from "@directus/sdk"
import { Document } from "app/lib/types"
import { Header } from "app/components/header"

export const VerificationApplyScreenComponent = () => {
    const { user, document } = userStore()
    const { token, rest } = directusStore()

    const [asset, setAsset] = useState<Asset<withUri>>()
    const [brokerId, setBrokerId] = useState("")
    const [attemptAgain, setAttemptAgain] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUploadDocument = async () => {
        const _asset = await pickDocuments({ multiple: false })
        setAsset(_asset.length ? _asset[0] : undefined)
    }

    const handleSendForVerification = async () => {
        setLoading(true)
        let fileId = ""
        if (asset) {
            fileId = await fileUpload(asset, documentsFolderId)
        }

        const newDocument = await rest.request(createItem("documents", {
            BRN: brokerId,
            ID_proof: fileId || undefined,
        })) as Document

        await fetch(`${directusUrl}/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                document: newDocument.id
            })
        })

        userStore.setState(p => ({ ...p, document: newDocument }))
        setLoading(false)
        setAttemptAgain(false)
    }

    return (!attemptAgain && document) ? <View className="flex-grow">
        <Header>
            <Text className="text-xl font-bold">Verification</Text>
        </Header>
        <Card className="mt-auto mb-0">
            <CardHeader>
                {!document.verified ? <>
                    <CardTitle>Verification pending</CardTitle>
                    <CardDescription>Please wait, we are yet to verify your identity</CardDescription>
                </> : <>
                    <CardTitle>Verification Done</CardTitle>
                    <CardDescription>Congratulations, you are now a verified agent</CardDescription>
                </>}
            </CardHeader>
            <CardContent className="flex-col gap-4">
                {document.BRN && <View className="flex-col gap-1">
                    <FormInput
                        label="Broker number"
                        value={document.BRN}
                        readOnly
                    />
                </View>}
                {document.ID_proof && <View className="flex-col gap-1">
                    <Text>Your submitted ID proof</Text>
                    <Button variant={"outline"} size={"sm"} className="self-start" onPress={() => Linking.openURL(buildAssetUrl(document.ID_proof))}>
                        <Text>Download</Text>
                    </Button>
                </View>}
            </CardContent>
            <CardFooter>
                <View className="flex-col gap-4 w-full">
                    <Text>You can still try with another attempt</Text>
                    <Button onPress={() => setAttemptAgain(true)} className="self-start ml-auto mr-0" size={"sm"} variant={"ghost"}>
                        <Text>Attempt again</Text>
                    </Button>
                </View>
            </CardFooter>
        </Card>
    </View> : <View className="flex-col gap-12 flex-1">
        <View className="flex-col gap-2">
            <Text className="text-xl text-primary">Document Verification</Text>
            <Text className="text-subtext">Use your Dubai Govt broker number for faster verification</Text>
            <Text className="text-warning">Either one of broker number or document is mandatory</Text>
        </View>
        <View className="flex-col gap-8">
            <FormInput
                label="BRN"
                placeholder="Enter your Broker number"
                value={brokerId}
                onChangeText={val => setBrokerId(val)}
            />
            <SeparatorText>
                <Text className="text-xs text-muted-foreground">OR</Text>
            </SeparatorText>
            <View className="flex-col gap-4">
                <Text>If you do not have broker number, you can upload other documents to verify your account</Text>
                <Text>Accepted ID's are</Text>
                <View className="flex-row flex-wrap gap-2">
                    {["Driver's license", "Passport"].map((id, i) => <Text className="rounded-full border border-foreground py-1 px-2 text-sm" key={i}>{id}</Text>)}
                </View>
            </View>
            {asset && <View className="flex-row gap-2 items-start">
                <Button onPress={() => setAsset(undefined)} variant={"base"} size={"none"} className="p-1 rounded bg-destructive/10">
                    <X size={14} className="text-destructive" />
                </Button>
                <Text className="text-info">{asset.name}</Text>
            </View>}
            <Button className="self-start" variant={"outline"} size={"sm"} onPress={handleUploadDocument}>
                <Text>Upload document</Text>
            </Button>
        </View>
        <Button className="mt-auto mb-0" onPress={handleSendForVerification} disabled={loading}>
            <Text>Send for verification</Text>
        </Button>
    </View>
}