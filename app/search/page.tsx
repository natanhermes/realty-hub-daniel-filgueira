import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SearchClientLayout } from "@/components/search-client-layout"

export default async function SearchLayout() {

  return (
    <>
      <Header />
      <SearchClientLayout />
      <Footer />
    </>
  )
}