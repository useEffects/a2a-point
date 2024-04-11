import { Image, Pressable, View } from "react-native"
import { buildAssetUrl } from "~/lib/helpers";
import { Text } from "./ui/text";
import { Asset, withId, withUri } from "./chat-ui";
import { Feather } from "@expo/vector-icons"
import { Button } from "./ui/button";
import { File } from "~/types";
import { useState } from "react";
import { BottomSheet } from "@rneui/base";

const imageMimeTypes: string[] = ["image/aces", "image/apng", "image/avci", "image/avcs", "image/avif", "image/bmp", "image/cgm", "image/dicom-rle", "image/dpx", "image/emf", "image/example", "image/fits", "image/g3fax", "image/heic", "image/heic-sequence", "image/heif", "image/heif-sequence", "image/hej2k", "image/hsj2", "image/j2c", "image/jls", "image/jp2", "image/jph", "image/jphc", "image/jpm", "image/jpx", "image/jxl", "image/jxr", "image/jxrA", "image/jxrS", "image/jxs", "image/jxsc", "image/jxsi", "image/jxss", "image/ktx", "image/ktx2", "image/naplps", "image/png", "image/prs.btif", "image/prs.pti", "image/pwg-raster", "image/svg+xml", "image/t38", "image/tiff", "image/tiff-fx", "image/vnd.adobe.photoshop", "image/vnd.airzip.accelerator.azv", "image/vnd.cns.inf2", "image/vnd.dece.graphic", "image/vnd.djvu", "image/vnd.dwg", "image/vnd.dxf", "image/vnd.dvb.subtitle", "image/vnd.fastbidsheet", "image/vnd.fpx", "image/vnd.fst", "image/vnd.fujixerox.edmics-mmr", "image/vnd.fujixerox.edmics-rlc", "image/vnd.globalgraphics.pgb", "image/vnd.microsoft.icon", "image/vnd.mix", "image/vnd.ms-modi", "image/vnd.mozilla.apng", "image/vnd.net-fpx", "image/vnd.pco.b16", "image/vnd.radiance", "image/vnd.sealed.png", "image/vnd.sealedmedia.softseal.gif", "image/vnd.sealedmedia.softseal.jpg", "image/vnd.svf", "image/vnd.tencent.tap", "image/vnd.valve.source.texture", "image/vnd.wap.wbmp", "image/vnd.xiff", "image/vnd.zbrush.pcx", "image/webp", "image/wmf", "image/emf", "image/wmf"];

imageMimeTypes.push("image/jpeg")

const ImageTile = ({ asset }: { asset: Pick<File, "id" | "type" | "filename_download"> }) => {

}

function getUrl(asset: Asset<withId | withUri>) {
    if ("id" in asset) {
        return buildAssetUrl(asset.id)
    } else return asset.uri
}

export const ImageGroup = ({ assets }: { assets: Asset<withId | withUri>[] }) => {
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

    const _assets = assets.slice(0, 2)

    return <Pressable className="flex-row gap-2 items-end relative p-2">
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-background bg-opacity-10 z-10" />
        {_assets.map((asset, key) => imageMimeTypes.includes(asset.mimeType) ? <Image key={key} source={{ uri: getUrl(asset) }} className="w-24 h-24 rounded" /> : <View key={key} className="w-20 h-24 bg-card rounded flex-row gap-2 justify-center items-center">
            <Feather size={24} className="!text-card-foreground" name="file" />
            <Text className="text-white text-xs">Documents</Text>
        </View>
        )}
        {assets.length > _assets.length ? <Text className="bg-accent text-accent-foreground px-1 rounded-full text-xs">
            +{assets.length - _assets.length} more
        </Text> : <></>}
        <BottomSheet isVisible={bottomSheetVisible}>

        </BottomSheet>
    </Pressable>
}