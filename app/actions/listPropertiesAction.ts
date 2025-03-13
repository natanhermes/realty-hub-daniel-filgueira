import { PropertyService } from "../services/propertyService";

export async function listPropertiesAction() {
  const properties = await PropertyService.listProperties();
  return properties;
}
