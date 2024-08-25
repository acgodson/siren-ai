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
import NoiseLevelKey from "@/components/organisms/noiseLevelKey";

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
    if (!mapboxToken) {
      return;
    }
    console.log(mapboxToken);
    //@ts-ignore
    if (mapboxgl) {
      (mapboxgl as any).accessToken = mapboxToken;
    }
    //@ts-ignore
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-2.5879, 51.4545],
      zoom: 12, // starting zoom
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
            <Box id="suggestion">
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
