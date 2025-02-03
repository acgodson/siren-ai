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
  Divider,
  Badge,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Car } from "lucide-react";
import { useAccount } from "wagmi";
import { useEthContext } from "@/evm/EthContext";

export default function NavDrawer() {
  const { address } = useAccount();
  const { handleLogin } = useEthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  const navItems = [
    {
      title: "Road",
      icon: <Car className="w-5 h-5" />,
      href: "/measure/road",
      isComingSoon: false,
    },
    {
      title: "Farm",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM19 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      href: "/measure/farm",
      isComingSoon: true,
    },
  ];

  return (
    <>
      <IconButton
        aria-label="menu"
        icon={<Image src="/icon-button.png" h="24px" />}
        ref={btnRef}
        variant="ghost"
        _hover={{ bg: "gray-50" }}
        onClick={onOpen}
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <DrawerContent>
          <DrawerCloseButton
            className="mt-6 mr-6"
            color="gray.500"
            _hover={{ color: "gray.700" }}
          />

          <DrawerBody className="pt-24 px-6">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.isComingSoon ? "#" : item.href}
                    className="group relative flex items-center gap-3 py-3 px-4 rounded-full transition-all duration-300"
                  >
                    <Box
                      className={`${
                        item.isComingSoon
                          ? "opacity-20 group-hover:opacity-30"
                          : "group-hover:opacity-80"
                      }`}
                    >
                      {item.icon}
                    </Box>
                    <span
                      className={`font-medium bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent ${
                        item.isComingSoon
                          ? "opacity-20 group-hover:opacity-30"
                          : "group-hover:opacity-80"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.isComingSoon && (
                      <span className="absolute top-0 right-2">
                        <Badge
                          colorScheme="gray"
                          variant="subtle"
                          fontSize="2xs"
                          className="px-1 py-0"
                        >
                          coming soon
                        </Badge>
                      </span>
                    )}
                  </a>
                  {index < navItems.length - 1 && (
                    <Divider my={2} borderColor="blackAlpha.200" />
                  )}
                </div>
              ))}
            </div>

            <Center className="mt-12">
              {!address && (
                <Button
                  h="40px"
                  px={8}
                  fontSize="md"
                  borderRadius="full"
                  bgGradient="linear(to-r, #D82B3C, #17101C)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, #17101C, #D82B3C)",
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
            </Center>
          </DrawerBody>

          <DrawerFooter
            borderTop="1px"
            borderColor="blackAlpha.200"
            flexDirection="column"
            alignItems="flex-start"
            className="space-y-2"
          >
            <Box className="text-sm text-gray-500">
              &copy; 2025 Building on BnB Greenfield
            </Box>
            <Box className="text-xs text-gray-400">v0.1.0</Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
