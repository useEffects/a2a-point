"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount";
import ListingsScreenComponent from "app/screens/listings";

export const Listings = useRenderAfterMount(ListingsScreenComponent)