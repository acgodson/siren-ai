import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  IconButton,
  Image,
  Box,
  Button,
  Center,
} from "@chakra-ui/react";
import { useRef, useMemo, useState } from "react";
import NavGroup from "./nav-group";
import { useAccount } from "wagmi";
import { useEthContext } from "@/evm/EthContext";

export default function NavDrawer() {
  const { address } = useAccount();
  const { handleLogin } = useEthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [segment, setSegments] = useState<number>(0);
  const btnRef = useRef(null);
  const navs = useMemo(
    () => [
      {
        title: "Measure",
        value: "measure",
        href: "/",
        isActive: segment === 0,
      },
      {
        title: "Map",
        value: "map",
        href: "/map",
        isActive: segment === 1,
      },
      {
        title: "Profile",
        value: "profile",
        href: "/profile",
        isActive: segment === 2,
      },
    ],
    [segment]
  );

  return (
    <>
      <IconButton
        mr={3}
        maxH={"45px"}
        w="auto"
        aria-label="menu"
        icon={<Image src="/icon-button.png" />}
        ref={btnRef as any}
        colorScheme="transparent"
        bg={"transparent"}
        onClick={onOpen}
      >
        Open
      </IconButton>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody mt={24}>
            <NavGroup navs={navs} />

            <Center>
              {!address && (
                <Button
                  h="45px"
                  px={12}
                  fontSize={"xl"}
                  borderRadius={"30px"}
                  bgGradient="linear(to-r, #D82B3C, #17101C)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, #17101C, #D82B3C)",
                  }}
                  className="py-5 cursor-pointer"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
            </Center>
          </DrawerBody>

          <DrawerFooter fontSize={"xs"}>
            <Box>&copy; 2024 Q2 BnB Hackathon</Box>
            <Box>&copy; v0.1.0</Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
