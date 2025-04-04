'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePropertiesAction() {
  revalidatePath('/dashboard/my-properties')
}
