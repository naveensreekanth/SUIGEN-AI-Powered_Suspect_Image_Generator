import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationMapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

const LocationMapPicker = ({ onLocationSelect, initialLat = 20.5937, initialLng = 78.9629 }: LocationMapPickerProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 5);
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add initial marker
    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Reverse geocode initial position
    reverseGeocode(initialLat, initialLng);

    // Handle marker drag
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      reverseGeocode(position.lat, position.lng);
    });

    // Handle map click
    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'SuspectIDApp/1.0',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const formattedAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(formattedAddress);
      onLocationSelect(lat, lng, formattedAddress);
    } catch (error) {
      console.error("Geocoding error:", error);
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(fallbackAddress);
      onLocationSelect(lat, lng, fallbackAddress);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current && markerRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
            markerRef.current.setLatLng([latitude, longitude]);
            reverseGeocode(latitude, longitude);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div 
        ref={mapContainerRef} 
        className="w-full h-[400px] rounded-lg border border-border shadow-lg z-0"
      />
      <div className="flex items-start gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          className="shrink-0"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Use My Location
        </Button>
        {address && (
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Selected Location:</p>
            <p className="text-sm mt-1">{address}</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to select incident location
      </p>
    </div>
  );
};

export default LocationMapPicker;
