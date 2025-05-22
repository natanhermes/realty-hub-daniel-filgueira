import Link from "next/link"
import { PropertyForm } from "@/components/property-form"
import { ArrowLeft, Slash } from "lucide-react"
import { auth } from "@/auth"

export default async function AddPropertyPage() {

  const session = await auth()

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-4 items-baseline">
        <Link href="/dashboard/my-properties" className="flex items-center text-muted-foreground hover:text-darkBlue mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <Slash className=" size-4 text-darkBlue -rotate-[24deg]" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-darkBlue mb-2">Cadastrar Novo Imóvel</h1>
        </div>
      </div>

      <PropertyForm userId={session?.user?.id} />
    </div>
  )
}
