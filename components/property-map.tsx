"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface PropertyMapProps {
  coordinates: {
    lat: number
    lng: number
  }
  address: string
}

export default function PropertyMap({ coordinates, address }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulação de um mapa - em um projeto real, você usaria Google Maps, Mapbox, etc.
    if (mapRef.current) {
      const mapElement = mapRef.current

      // Estilizando o elemento para simular um mapa
      mapElement.style.position = "relative"
      mapElement.style.backgroundColor = "#e5e7eb"
      mapElement.style.height = "100%"
      mapElement.style.width = "100%"
      mapElement.style.overflow = "hidden"

      // Adicionando linhas de grade para simular um mapa
      mapElement.innerHTML = `
        <div style="position: absolute; inset: 0; opacity: 0.2;">
          ${Array(10)
            .fill(0)
            .map(
              (_, i) =>
                `<div style="position: absolute; left: 0; right: 0; top: ${i * 10}%; height: 1px; background-color: #000;"></div>
             <div style="position: absolute; top: 0; bottom: 0; left: ${i * 10}%; width: 1px; background-color: #000;"></div>`,
            )
            .join("")}
        </div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -100%); color: #ef4444;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div style="position: absolute; bottom: 10px; left: 10px; background-color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${address}
        </div>
        <div style="position: absolute; bottom: 10px; right: 10px; background-color: white; padding: 4px; border-radius: 4px; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="display: flex; gap: 4px;">
            <button style="border: none; background: none; cursor: pointer; padding: 4px;">+</button>
            <button style="border: none; background: none; cursor: pointer; padding: 4px;">−</button>
          </div>
        </div>
      `
    }
  }, [address])

  return (
    <div ref={mapRef} className="h-full w-full rounded-lg">
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-primary mr-2" />
          <span className="text-sm">{address}</span>
        </div>
      </div>
    </div>
  )
}
