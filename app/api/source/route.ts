import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const source = fs
    .readFileSync(path.resolve('./public', "source.js"))
    .toString();
export async function GET(request: NextRequest) {
    return new Response(source);
}