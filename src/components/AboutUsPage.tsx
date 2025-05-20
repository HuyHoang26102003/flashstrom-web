"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import AuthDialogContent from "./AuthDialogContent";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/adminStore";
import { IMAGE_LINKS } from "@/assets/imageLinks";
import { useCustomerCareStore } from "@/stores/customerCareStore";

const AboutUsPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const adminZ = useAdminStore((state) => state.user);
  const customerCareZ = useCustomerCareStore((state) => state.user);
  const logout = useAdminStore((state) => state.logout);
  const userAvatar =
    adminZ?.avatar?.url ||
    customerCareZ?.avatar?.url ||
    IMAGE_LINKS.DEFAULT_AVATAR;

  const [date2, setDate2] = useState<Date | undefined>(new Date());
  const [date1, setDate1] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });

  return (
    <div className="fc">
      {/* <PageTitle
        date1={date1}
        setDate1={setDate1}
        date2={date2}
        setDate2={setDate2}
      /> */}
      <div className="jb gap-4 max-lg:grid max-lg:grid-cols-1">
        <div className="card lg:flex-1 fc p-6">
          <h1 className="text-2xl font-bold mb-4">About FlashFood</h1>
          <p className="mb-4">
            FlashFood is a revolutionary platform dedicated to reducing food
            waste and providing affordable meals to our community. Our mission
            is to connect consumers with local restaurants and grocery stores to
            rescue surplus food that would otherwise go to waste.
          </p>
          <p className="mb-4">
            Founded in late 2024, we've quickly grown to serve multiple cities
            and have saved thousands of meals from being thrown away, making a
            significant impact on both food waste reduction and affordability.
          </p>
        </div>

        <div className="card lg:flex-1 fc p-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Log In</Button>
            </DialogTrigger>
            <AuthDialogContent onClose={() => setOpen(false)} />
          </Dialog>
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button>Log In</Button>
            </PopoverTrigger>
            <PopoverContent className="">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => logout()}
                    variant={"ghost"}
                    className="text-red-500 hover:bg-red-100 w-full justify-start bg-grey"
                  >
                    Log Out
                  </Button>
                </DialogTrigger>
                <AuthDialogContent onClose={() => setOpen(false)} />
              </Dialog>
            </PopoverContent>
          </Popover> */}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
