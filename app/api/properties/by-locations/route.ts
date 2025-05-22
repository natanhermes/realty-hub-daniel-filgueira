import { NextResponse, type NextRequest } from "next/server";
import { PropertyService } from "@/app/services/propertyService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const location = searchParams.get('location')

  const properties = await PropertyService.listPropertiesByLocations(location!)
  return NextResponse.json(properties)
}
