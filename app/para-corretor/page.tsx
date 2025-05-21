'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function ParaCorretor() {
  return (
    <>
      <Navbar />
      <div className="bg-leadGray w-full px-4 py-8 mt-24 pb-28">

        <div className=" container mx-auto  max-w-4xl flex flex-col items-center justify-center gap-8">
          <h1 className="text-lg md:text-3xl font-bold mb-6 text-whiteIce text-center">Se você é corretor, temos uma super novidade para você! Assista o vídeo abaixo!</h1>
          <div className="w-full h-[200px] md:h-[400px] lg:h-[500px] border-2 border-dashed border-whiteIce rounded-xl">
            {/* <video
          className="w-full h-full rounded-xl"
          src="https://d1jn39u3umq5qg.cloudfront.net/static-images/video.mp4"
          autoPlay
          loop
          playsInline
          controls={false}
        /> */}
          </div>

          <Button
            className="bg-green-600 hover:bg-green-700 mt-4 text-lg md:text-xl"
            onClick={() => window.open('https://wa.me/558496703029?text=Olá! Sou corretor e gostaria de saber mais informações.')}
          >
            Mais informações
            <Image src="/assets/wpp.svg" alt="WhatsApp" className='w-6 h-6 ml-2' />
          </Button>
        </div>
      </div>
      <Footer />
    </>
  )
}
