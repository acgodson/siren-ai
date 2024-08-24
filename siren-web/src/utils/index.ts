import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) {
    return address; // Return original if too short to shorten
  }
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export const generateMarkdown = (data: any) => {
  const instructionSteps = data.Instructions.split("\n").filter(
    (step: any) => step.trim() !== ""
  );

  const formattedInstructions = instructionSteps
    .map((step: any) => `- ${step.trim()}`)
    .join("\n");

  return `
# ${data.Title}

${data.Description}

#### Cuisine Type: ${data.CuisineType}
#### Diet Type: ${data.DietType}

### Ingredients

| Ingredient | Quantity | Unit |
|------------|---------|------|
${data.ingredients
  .map((ing: any) => `| ${ing.Name} | ${ing.Quantity} | ${ing.Unit ?? ""} |`)
  .join("\n")}

---
### Instructions

${formattedInstructions}

---
#### Tags

${data.Tags}
  `;
};

export const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  if (!host && typeof window !== "undefined") {
    // On client side, get the host from window
    host = window.location.host;
  }
  if (host && host.includes(".")) {
    const candidate = host.split(".")[0];
    if (candidate && !candidate.includes("localhost")) {
      // Valid candidate
      subdomain = candidate;
    }
  }
  return subdomain;
};
