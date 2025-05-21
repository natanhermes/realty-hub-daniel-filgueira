import { NextRequest, NextResponse } from "next/server";
import { PropertyService } from "@/app/services/propertyService";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { filters, itemsPerPage } = body

  const properties = await PropertyService.listPropertiesByFilters(filters, itemsPerPage)

  return NextResponse.json(properties)
}

export async function GET() {
  const properties = await PropertyService.listProperties()
  return NextResponse.json(properties)
}
