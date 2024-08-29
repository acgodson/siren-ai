"use client";
import { motion } from "framer-motion";
import { useState } from "react";

import { cn } from "../../utils";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useEthContext } from "@/evm/EthContext";

type Nav = {
  title: string;
  value: string;
  href: string;
  isActive: boolean;
};

const NavGroup = ({
  navs: propNavs,
  containerClassName,
  activeNavClassName,
  navClassName,
}: {
  navs: Nav[];
  containerClassName?: string;
  activeNavClassName?: string;
  navClassName?: string;
}) => {
  const initialActiveNav = propNavs.find((nav) => nav.isActive) || propNavs[0];
  const { authenticated } = usePrivy();
  const { handleLogin } = useEthContext();
  const [active, setActive] = useState<Nav>(initialActiveNav);
  const [navs, setNavs] = useState<Nav[]>(propNavs);

  const host = process.env.NEXT_PUBLIC_HOST;

  const moveSelectedNavToTop = (idx: number) => {
    const newNavs = [...propNavs];
    const selectedNav = newNavs.splice(idx, 1);
    newNavs.unshift(selectedNav[0]);
    setNavs(newNavs);
    setActive(newNavs[0]);
  };

  return (
    <div className="flex flex-col sm:flex-row py-8 sm:py-0 items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full">
      {propNavs.map((nav, idx) => (
        <Link
          key={nav.title}
          onClick={
            nav.href === "/" && !authenticated
              ? handleLogin
              : () => {
                  moveSelectedNavToTop(idx);
                }
          }
          className={cn("relative px-4 py-2 rounded-full", navClassName)}
          style={{
            transformStyle: "preserve-3d",
          }}
          href={
            nav.href === "/" && !authenticated
              ? "#"
              : nav.href === "/"
              ? `/home`
              : nav.href
          }
        >
          {active.value === nav.value && (
            <motion.div
              layoutId="clickedbutton"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            />
          )}

          <span className="text-zinc-900">{nav.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default NavGroup;
