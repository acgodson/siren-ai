import { Box, Button, Image, Text, Flex, Badge } from "@chakra-ui/react";
import { Car } from "lucide-react";
import { useAccount } from "wagmi";
import { useEthContext } from "@/evm/EthContext";
import { shortenAddress } from "@/utils";
import ChatDialog from "../molecules/chat-dialog";
import NavDrawer from "../molecules/nav-drawer";

const Header = ({ className }: { className?: string }) => {
  const { handleLogin } = useEthContext();
  const { address } = useAccount();
  const { toggleAccountModal } = useEthContext();

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
    <Box className="border-b border-gray-200" py={4} px={[2, 2, 10]} bg="white">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="h-full"
      >
        {/* Logo */}
        <Box>
          <a className="flex items-center space-x-2" href="/home">
            <Image
              h={["30px", "30px", "40px"]}
              alt="siren-logo"
              src="/vercel.png"
              style={{ width: "auto" }}
            />
          </a>
        </Box>

        {/* Navigation - Desktop */}
        <Flex
          display={["none", "none", "flex"]}
          gap={8}
          alignItems="center"
          className="mx-auto"
        >
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.isComingSoon ? "#" : item.href}
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
            >
              <Box
                className={`${
                  item.isComingSoon
                    ? " opacity-20 group-hover:opacity-30"
                    : "group-hover:opacity-80"
                }`}
              >
                {item.icon}
              </Box>
              <span
                className={`font-medium bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent  ${
                  item.isComingSoon
                    ? " opacity-20 group-hover:opacity-30"
                    : "group-hover:opacity-80"
                }`}
              >
                {item.title}
              </span>
              {item.isComingSoon && (
                <span className="absolute -top-0 -right-16 flex h-4 w-auto min-w-max">
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
          ))}
        </Flex>

        {/* Auth Button */}
        <Box display={["none", "none", "block"]}>
          {!address ? (
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
          ) : (
            <Button
              h="40px"
              px={6}
              fontSize="sm"
              borderRadius="full"
              bgGradient="linear(to-r, #D82B3C, #17101C)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, #17101C, #D82B3C)",
              }}
              onClick={toggleAccountModal}
              rightIcon={<Text fontSize="sm">0.00</Text>}
            >
              {shortenAddress(address)}
            </Button>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box display={["block", "block", "none"]}>
          <NavDrawer />
        </Box>

        <ChatDialog />
      </Flex>
    </Box>
  );
};

export default Header;
