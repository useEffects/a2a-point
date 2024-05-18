import { Image, Pressable, View } from "react-native"
import { buildAssetUrl, shortString } from "app/lib/helpers";
import { Text } from "./ui/text";
import { Asset, withId, withUri } from "./chat-ui";
import { Feather } from "@expo/vector-icons"
import { useState } from "react";
import { BottomSheet } from "@rneui/base";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "./ui/button";

const imageMimeTypes: string[] = ["image/aces", "image/apng", "image/avci", "image/avcs", "image/avif", "image/bmp", "image/cgm", "image/dicom-rle", "image/dpx", "image/emf", "image/example", "image/fits", "image/g3fax", "image/heic", "image/heic-sequence", "image/heif", "image/heif-sequence", "image/hej2k", "image/hsj2", "image/j2c", "image/jls", "image/jp2", "image/jph", "image/jphc", "image/jpm", "image/jpx", "image/jxl", "image/jxr", "image/jxrA", "image/jxrS", "image/jxs", "image/jxsc", "image/jxsi", "image/jxss", "image/ktx", "image/ktx2", "image/naplps", "image/png", "image/prs.btif", "image/prs.pti", "image/pwg-raster", "image/svg+xml", "image/t38", "image/tiff", "image/tiff-fx", "image/vnd.adobe.photoshop", "image/vnd.airzip.accelerator.azv", "image/vnd.cns.inf2", "image/vnd.dece.graphic", "image/vnd.djvu", "image/vnd.dwg", "image/vnd.dxf", "image/vnd.dvb.subtitle", "image/vnd.fastbidsheet", "image/vnd.fpx", "image/vnd.fst", "image/vnd.fujixerox.edmics-mmr", "image/vnd.fujixerox.edmics-rlc", "image/vnd.globalgraphics.pgb", "image/vnd.microsoft.icon", "image/vnd.mix", "image/vnd.ms-modi", "image/vnd.mozilla.apng", "image/vnd.net-fpx", "image/vnd.pco.b16", "image/vnd.radiance", "image/vnd.sealed.png", "image/vnd.sealedmedia.softseal.gif", "image/vnd.sealedmedia.softseal.jpg", "image/vnd.svf", "image/vnd.tencent.tap", "image/vnd.valve.source.texture", "image/vnd.wap.wbmp", "image/vnd.xiff", "image/vnd.zbrush.pcx", "image/webp", "image/wmf", "image/emf", "image/wmf"];

imageMimeTypes.push("image/jpeg")

const ImageTile = ({ asset, full = false }: { asset: Asset<withId | withUri>, full?: boolean }) => {
    return imageMimeTypes.includes(asset.mimeType) ? full ? <Image source={{ uri: getUrl(asset) }} /> : <Image className="w-28 h-28 object-contain rounded" source={{ uri: getUrl(asset) }} /> : <View className="w-28 h-12 bg-card rounded-2xl flex-row gap-1 justify-center items-center">
        <Feather size={18} className="!text-card-foreground" name="file" />
        <Text className="text-card-foreground text-xs">{shortString(asset.name)}</Text>
    </View>
}

function getUrl(asset: Asset<withId | withUri>) {
    if ("id" in asset) {
        return buildAssetUrl(asset.id)
    } else return asset.uri
}

export const ImageGroup = ({ assets }: { assets: Asset<withId | withUri>[] }) => {
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

    const _assets = assets.slice(0, 2)

    return <Pressable onPress={() => setBottomSheetVisible(true)} className="flex-row gap-1 mb-2 items-end">
        {_assets.map((asset, key) => <ImageTile key={key} asset={asset} />)}
        {assets.length > _assets.length ? <Text className="bg-accent text-accent-foreground px-1 rounded-full text-xs">
            +{assets.length - _assets.length} more
        </Text> : <></>}
        <BottomSheet isVisible={bottomSheetVisible} onBackdropPress={() => setBottomSheetVisible(false)}>
            <View className="p-2 bg-popover flex-col">
                <FlatList
                    scrollEnabled={false}
                    data={assets}
                    renderItem={({ item }) => <ImageTile asset={item} full={true} />}
                    ListHeaderComponent={<View className="my-4 flex-row gap-2 items-center">
                        <Button variant={"ghost"} onPress={() => setBottomSheetVisible(false)} size={"icon"}>
                            <Feather size={18} name="arrow-left" className="!text-foreground" />
                        </Button>
                        <View>
                            <Text className="">All Attachments</Text>
                            <Text className="text-sm">{assets.length} items</Text>
                        </View>
                    </View>}
                    ItemSeparatorComponent={() => <View className="h-2" />}
                />
            </View>
        </BottomSheet>
    </Pressable>
}