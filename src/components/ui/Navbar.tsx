"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { SignIn, useClerk, UserButton, useUser } from '@clerk/nextjs'

export function NavbarDemo() {
  const navItems = [
    {
      name : "Home",
      link : "/"
    },
    {
      name: "Pricing",
      link: "/pricing",
    },
    {
      name: "Wallet",
      link: "/wallets",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const { isSignedIn } = useUser()
 const {openSignIn} = useClerk()


  return (
    <div className="relative w-full bg-black text-white">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems className="text-white" items={navItems} />
          <div className="flex items-center gap-4">
            {isSignedIn ? 
                <UserButton/>
               :
               <NavbarButton
                onClick={() => openSignIn()}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
            }
        
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
      
               {isSignedIn ? 
                <UserButton/>
               :
               <NavbarButton
                onClick={() => openSignIn()}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
            }
            
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

    </div>
  );
}

