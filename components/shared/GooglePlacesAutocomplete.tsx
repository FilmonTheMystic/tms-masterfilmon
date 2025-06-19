'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Loader2 } from 'lucide-react';

interface PlaceDetails {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function GooglePlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Start typing an address...",
  className,
  disabled
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key is not configured');
      setIsLoading(false);
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      setIsApiLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps API');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  };

  const initializeAutocomplete = () => {
    if (!window.google || !inputRef.current || autocompleteRef.current) return;

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'ZA' }, // Restrict to South Africa
        fields: ['address_components', 'formatted_address', 'geometry', 'name']
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.address_components) {
          return;
        }

        // Parse address components
        const addressComponents = place.address_components;
        const placeDetails: PlaceDetails = {
          address: '',
          city: '',
          province: '',
          postalCode: '',
          country: ''
        };

        // Extract detailed address information
        for (const component of addressComponents) {
          const types = component.types;
          
          if (types.includes('street_number')) {
            placeDetails.address = component.long_name + ' ';
          } else if (types.includes('route')) {
            placeDetails.address += component.long_name;
          } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            placeDetails.city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            placeDetails.province = component.long_name;
          } else if (types.includes('postal_code')) {
            placeDetails.postalCode = component.long_name;
          } else if (types.includes('country')) {
            placeDetails.country = component.long_name;
          }
        }

        // If no street address found, use the place name or formatted address
        if (!placeDetails.address.trim()) {
          placeDetails.address = place.name || place.formatted_address || '';
        }

        // Add coordinates if available
        if (place.geometry && place.geometry.location) {
          placeDetails.coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
        }

        // Update the input value with formatted address
        const fullAddress = place.formatted_address || value;
        onChange(fullAddress);

        // Call the place select callback with detailed information
        if (onPlaceSelect) {
          onPlaceSelect(placeDetails);
        }
      });

    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      setError('Failed to initialize address autocomplete');
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (isApiLoaded) {
      initializeAutocomplete();
    }
  }, [isApiLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="space-y-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
        />
        <Alert variant="destructive">
          <AlertDescription className="text-xs">
            {error} - Using regular text input instead.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isLoading ? "Loading address search..." : placeholder}
          className={`pl-10 ${className}`}
          disabled={disabled || isLoading}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {isApiLoaded && (
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Address suggestions powered by Google Maps
        </div>
      )}
    </div>
  );
}