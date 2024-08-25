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
//@ts-ignore
import mapboxgl from "mapbox-gl";
//@ts-ignore
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
  const [tolocation, setToLocation] = useState<any>("");

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
    // Clean up the map instance on component unmount
    return () => map.remove();
  }, [mapboxToken]);

  return (
    <DashboardWrapper
      items={[
        <InputGroup key="2" mb={4}>
          <Input placeholder="From" />
        </InputGroup>,
        <InputGroup key="1" mb={4}>
          <Input placeholder="From" />
        </InputGroup>,
        <Button
          h="45px"
          px={4}
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
