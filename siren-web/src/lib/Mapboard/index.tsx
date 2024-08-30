"use client";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { PenToolIcon } from "lucide-react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {
  DashboardWrapper,
  LayoutContent,
  LayoutFooter,
} from "../../components/template/dashboard-wrapper";
import NoiseLevelKey from "@/components/molecules/noiseLevelKey";
import { useEthContext } from "@/evm/EthContext";

const roadNoiseGeoJsonData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        noise_level: 25, // Quiet
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-2.5879, 51.4545],
          [-2.589, 51.455],
          [-2.59, 51.4555],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        noise_level: 55, // Moderately Loud
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-2.6, 51.46],
          [-2.601, 51.461],
          [-2.602, 51.462],
        ],
      },
    },
    // Add more LineString features representing roads with varying noise levels
  ],
};

function Mapboard() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAP_API;
  const { isAccountModalOpen, toggleAccountModal, handleLogout } =
    useEthContext();

  const [location, setLocation] = useState<any>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const geocoderElement = document.getElementById("geocoder");
    const suggestionBox = document.getElementById("suggestion");

    if (!geocoderElement) {
      const geocoderBox = document.createElement("div");
      geocoderBox.id = "geocoder";
      geocoderBox.style.border = "1px solid #ccc";
      geocoderBox.style.borderRadius = "md";
      geocoderBox.style.boxShadow = "md";
      suggestionBox?.appendChild(geocoderBox);
    }

    if (showAutocomplete) {
      if (geocoderElement) {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxToken as string,
          types: "country,region,place,postcode,locality,neighborhood,address",
          getItemValue: (x: any) => x.address,
        });

        if (geocoderElement.children.length < 1) {
          geocoder.addTo("#geocoder");
        }

        // geocoder.on("result", (e: any) => {
        //   if (e && e.result) {
        //     console.log("resulting", e.result);
        //     setLocation(e.result);
        //     return geocoderElement?.remove();
        //   }
        // });

        geocoder.on("result", (e: any) => {
          if (e && e.result) {
            setLocation(e.result);
            setShowAutocomplete(false);

            // Update map location
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: e.result.center,
                zoom: 12,
              });
            }
          }
        });

        geocoder.on("clear", () => {
          setLocation("");
        });
      }
    }
  }, [showAutocomplete]);

  useEffect(() => {
    if (!mapboxToken) return;
    //@ts-ignore
    if (mapboxgl) {
      (mapboxgl as any).accessToken = mapboxToken;
    }
    //@ts-ignore
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-2.5879, 51.4545],
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
    });
    // Add heatmap layer (sample data)
    map.on("load", () => {
      // Neutralize text labels
      const labelLayers = [
        "country-label",
        "state-label",
        "settlement-subdivision-label",
        "airport-label",
        "poi-label",
        "water-point-label",
        "water-line-label",
        "natural-point-label",
        "natural-line-label",
        "waterway-label",
      ];

      labelLayers.forEach((layer) => {
        map.setPaintProperty(layer, "text-color", "#CCCCCC");
        map.setPaintProperty(layer, "text-halo-color", "#FFFFFF");
      });

      map.addSource("roadNoiseData", {
        type: "geojson",
        data: roadNoiseGeoJsonData as any,
      });

      map.addLayer({
        id: "road-noise-lines",
        type: "line",
        source: "roadNoiseData",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-width": 7,
          "line-opacity": 0.8,
          "line-color": [
            "interpolate",
            ["linear"],
            ["get", "noise_level"],
            0,
            "#00FF00", // Quiet (Green)
            25,
            "#ADFF2F", // Moderate (Light Green)
            50,
            "#FFD700", // Moderately Loud (Yellow)
            75,
            "#FF8C00", // Loud (Orange)
            100,
            "#FF0000", // Very Loud (Red)
          ],
        },
      });

      // Reverse geocode the initial coordinates
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/-2.597298,51.453802.json?access_token=${mapboxToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            setLocation(data.features[0]);
          }
        });
    });

    mapRef.current = map;

    return () => map.remove();
  }, [mapboxToken]);

  useEffect(() => {
    console.log(location);
  }, [showAutocomplete]);

  return (
    <DashboardWrapper
      items={[
        <Box w="100%" position={"relative"} mb={6}>
          <Heading
            textAlign={"center"}
            size={["lg", "lg", "lg", "lg"]}
            color="#020202"
            fontWeight={"semibold"}
            mb={3}
          >
            Toggle location
          </Heading>
          <Input
            w="100%"
            id="result"
            position={"relative"}
            placeholder="Map around Location"
            type="text"
            value={location ? location.place_name : ""}
            isReadOnly={true}
            onClick={() => setShowAutocomplete(!showAutocomplete)}
            required
          />
          {showAutocomplete && (
            <Box id="suggestion" bg="white">
              <Box
                as="div"
                mt={2}
                border="1px solid #ccc"
                borderRadius="md"
                boxShadow="md"
                id="geocoder"
              />
            </Box>
          )}
        </Box>,
        // <InputGroup key="1" mb={4}>
        //   <Input placeholder="To" />
        // </InputGroup>,
        <Button
          h="45px"
          px={4}
          mt={[4, 4, 0]}
          w="100%"
          fontSize={"xl"}
          borderRadius={"30px"}
          bgGradient="linear(to-r, #D82B3C, #17101C)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, #17101C, #D82B3C)",
          }}
          className="py-5 cursor-pointer"
          rightIcon={<img src="/toggle-ai.png" alt="toggle-AI" />}
          onClick={toggleAccountModal}
        >
          AI
        </Button>,
      ]}
    >
      <LayoutContent>
        <Box pt={1} w="full">
          <Heading
            textAlign={"center"}
            size={["lg", "lg", "lg", "lg"]}
            color="#020202"
            fontWeight={"semibold"}
          >
            Mapboard
          </Heading>
        </Box>

        <Center>
          <Box
            mt={6}
            w="100%"
            position={"relative"}
            h="80vh"
            maxW="818px"
            borderRadius={"50px"}
            bgGradient="linear(to-t, #D82B3C, #17101C)"
            p={1}
            overflow="hidden"
          >
            <Box
              style={{
                borderRadius: "50px",
              }}
              w="full"
              h="full"
              borderRadius={"50px"}
              bg="white"
              id="map"
            />
          </Box>
        </Center>

        <Box
          py={8}
          mt={12}
          pb={8}
          borderTop={"1px solid #333"}
          borderBottom={"1px solid #333"}
        >
          <NoiseLevelKey />
        </Box>
      </LayoutContent>

      <LayoutFooter>
        <p>&copy; 2024 Siren</p>
      </LayoutFooter>
    </DashboardWrapper>
  );
}

export default Mapboard;
