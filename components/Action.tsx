"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeIcon } from "lucide-react";

export function Action() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <HomeIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            router.push("/");
          }}
        >
          Home1
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/");
          }}
        >
          Home2
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/");
          }}
        >
         Home3
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/");
          }}
        >
          Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
