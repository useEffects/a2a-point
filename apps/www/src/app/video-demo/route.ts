import { videoDemoUrl } from "@/lib/constants";
import { NextResponse } from "next/server";

export const GET = () => NextResponse.redirect(videoDemoUrl)