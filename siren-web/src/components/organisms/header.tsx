import { useMemo, useState } from "react";
import { Box, Button, Image } from "@chakra-ui/react";
import NavGroup from "../molecules/nav-group";

import { useAccount } from "wagmi";
import { useEthContext } from "@/evm/EthContext";

const Header = ({ className }: { className?: string }) => {
  const [segment, setSegments] = useState<number>(0);
  const { address } = useAccount();
  const { toggleAccountModal } = useEthContext();
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
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      pt={5}
      px={[2, 2, 10]}
    >
      <Box display={["block", "block", "block"]}>
        <a className="flex space-x-2 text-md" target="_blank" href="#">
          <Image
            className="mt-0 opacity-100"
            h={["30px", "30px", "50px"]}
            alt="zercom-logo"
            src={"/vercel.png"}
            style={{
              width: "auto",
            }}
          />
        </a>
      </Box>

      <Box display={["none", "none", "block"]}>
        <NavGroup navs={navs} />
      </Box>

      <Box display={["none", "none", "block"]}>
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
            onClick={toggleAccountModal}
          >
            Login
          </Button>
        )}
      </Box>

      {/* <ProfileDialog /> */}
    </Box>
  );
};

export default Header;
