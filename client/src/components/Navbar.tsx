"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 bg-primary-700 text-white shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-6">
        {/* Logo and Left Side */}
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/pristineprimer-navbar-logo@2x.png"
            alt="Logo"
            width={1000}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>


          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="hidden md:flex ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search"
                )
              }
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="hidden md:block ml-2">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Desktop Nav Links - Only show on non-dashboard pages */}
        {!isDashboardPage && (
          <nav className="hidden md:flex gap-6 font-heading">
            <Link href="/" className="hover:text-accent">Home</Link>
            <Link href="/for-sale" className="hover:text-accent">For Sale</Link>
            <Link href="/for-rent" className="hover:text-accent">For Rent</Link>
            <Link href="/properties" className="hover:text-accent">Properties</Link>
            <Link href="/services" className="hover:text-accent">Services</Link>
            <Link href="/contact" className="hover:text-accent">Contact</Link>
          </nav>
        )}

        
        {/* Desktop Right Side Buttons / Avatar */}
        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              <div className="hidden md:flex items-center gap-5">
                <div className="relative">
                  <MessageCircle className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
                </div>
                <div className="relative">
                  <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback className="bg-primary-600">
                      {authUser.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">{authUser.userInfo?.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary-700">
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-white font-bold"
                    onClick={() =>
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites",
                        { scroll: false }
                      )
                    }
                  >
                    Go to Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary-200" />
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-white"
                    onClick={() =>
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        { scroll: false }
                      )
                    }
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-white"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-500 hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-8 w-8 text-white" />
              ) : (
                <Menu className="h-8 w-8 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-700 text-white px-6 pb-4">
          <nav className="flex flex-col gap-4 font-heading py-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/for-sale" onClick={() => setMobileMenuOpen(false)}>For Sale</Link>
            <Link href="/for-rent" onClick={() => setMobileMenuOpen(false)}>For Rent</Link>
            <Link href="/properties" onClick={() => setMobileMenuOpen(false)}>Properties</Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </nav>
          
          {authUser && isDashboardPage && (
            <div className="mt-4 mb-4">
              <Button
                variant="secondary"
                className="w-full bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push(
                    authUser.userRole?.toLowerCase() === "manager"
                      ? "/managers/newproperty"
                      : "/search"
                  );
                }}
              >
                {authUser.userRole?.toLowerCase() === "manager" ? (
                  <>
                    <Plus className="h-4 w-4" />
                    <span className="ml-2">Add New Property</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span className="ml-2">Search Properties</span>
                  </>
                )}
              </Button>
            </div>
          )}
          
          <div className="mt-4 flex flex-col gap-2">
            {authUser ? (
              <>
                
                <Button
                  variant="secondary"
                  className="bg-secondary-600 hover:bg-white hover:text-primary-700"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="secondary"
                    className="w-full text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;