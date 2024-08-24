import React, { useEffect, useState } from "react";
import { NextRequest } from "next/server";
import { getValidSubdomain } from "@/utils";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export async function DomainRouter(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) return;

  const host = req.headers.get("host");
  const subdomain = getValidSubdomain(host);
  if (subdomain) {
    // Subdomain available, rewriting
    console.log(
      `>>> Rewriting: ${url.pathname} to /${subdomain}${url.pathname}`
    );
    url.pathname = `/${subdomain}${url.pathname}`;
  }
}
