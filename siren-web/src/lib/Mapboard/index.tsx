"use client";
import { useEffect, useState } from "react";
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
  const [fromlocation, setFromLocation] = useState<any>("");
  // const [tolocation, setToLocation] = useState<any>("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

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
          types: "country,region,place,postcode,locality,neighborhood",
          getItemValue: (x: any) => x.address,
        });

        if (geocoderElement.children.length < 1) {
          geocoder.addTo("#geocoder");
        }

        geocoder.on("result", (e: any) => {
          if (e && e.result) {
            console.log("resulting", e.result);
            setFromLocation(e.result);
            return geocoderElement?.remove();
          }
        });

        geocoder.on("clear", () => {
          setFromLocation("");
        });
      }
    }
  }, [showAutocomplete]);

  useEffect(() => {
    if (!mapboxToken) return;

    console.log(mapboxToken);
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
        "settlement-label",
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
      // map.setPaintProperty("water", "fill-color", "#EAEAEA");
      // map.setPaintProperty("landuse", "fill-color", "#F5F5F5");
      // map.setPaintProperty("building", "fill-color", "#D3D3D3");

      // Neutralize major link roads
      map.setPaintProperty("road-major-link", "line-color", "#D3D3D3");
      map.setPaintProperty("road-secondary-tertiary", "line-color", "#EAEAEA");
      map.setPaintProperty("road-primary", "line-color", "#EAEAEA");
      map.setPaintProperty("road-motorway-trunk", "line-color", "#EAEAEA");

      map.setPaintProperty("road-network", "line-opacity", 0.2);

      map.setFilter("road-label", ["!=", "class", "motorway"]);

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
    });

    return () => map.remove();
  }, [mapboxToken]);

  useEffect(() => {
    console.log(showAutocomplete);
  }, [showAutocomplete]);

  return (
    <DashboardWrapper
      items={[
        <Box w="100%" position={"relative"} mb={3}>
          <Input
            w="100%"
            id="result"
            position={"relative"}
            placeholder="From Location"
            type="text"
            value={fromlocation ? fromlocation.place_name : ""}
            isReadOnly={true}
            onClick={() => setShowAutocomplete(!showAutocomplete)}
            required
          />
          {fromlocation.place_name && (
            <PenToolIcon
              style={{ cursor: "pointer" }}
              onClick={() => setShowAutocomplete(!showAutocomplete)}
            />
          )}
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

        <InputGroup key="1" mb={4}>
          <Input placeholder="To" />
        </InputGroup>,
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
