import { NextResponse } from "next/server";
import { PropertyService } from "@/app/services/propertyService";

export async function GET() {
  const properties = await PropertyService.listHighlightedProperties()
  return NextResponse.json(properties)
}
