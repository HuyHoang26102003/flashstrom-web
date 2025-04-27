"use client";
import { IMAGE_LINKS } from "@/assets/imageLinks";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customerCareService } from "@/services/companion-admin/customerCareService";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Power, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";

interface CustomerCare {
  id: string;
  first_name: string;
  last_name: string;
  active_points: number;
  avatar: {
    url: string;
    key: string;
  };
  is_assigned: boolean;
  available_for_work: boolean;
  address: string;
  contact_email: {
    email: string;
  }[];
}

export const columns: ColumnDef<CustomerCare>[] = [
  {
    accessorKey: "contact_email",
    header: ({ column }) => (
      <Button
        className="text-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const cc = row.original;
      return (
        <div className="flex flex-row items-center gap-2">
          <Image
            src={cc?.avatar?.url ?? IMAGE_LINKS.DEFAULT_AVATAR}
            alt="avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>{cc?.contact_email[0]?.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="text-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const cc = row.original;
      return (
        <div className="text-center">
          {cc.first_name} {cc.last_name}
        </div>
      );
    },
  },
  {
    accessorKey: "is_assigned",
    header: ({ column }) => (
      <Button
        className="text-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Assignment Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("is_assigned") ? "Assigned" : "Unassigned"}
      </div>
    ),
  },
  {
    accessorKey: "active_points",
    header: ({ column }) => (
      <Button
        className="text-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Active Points
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("active_points")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const cc = row.original;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-full p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="grid gap-4">
              <Button
                variant="ghost"
                className="flex items-center justify-start"
                onClick={() => {
                  // Handle view details
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Details
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start"
              >
                <Power className="mr-2 h-4 w-4" />
                {"Deactivate"}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];

const Page = () => {
  const [customerCare, setCustomerCare] = useState<CustomerCare[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCustomerCare();
  }, []);

  const fetchCustomerCare = async () => {
    setIsLoading(true);
    try {
      const result = await customerCareService.getAllCustomerCareRepresentatives();
      console.log("Result from API:", result);
      
      // Handle both array and object with data property
      const careData = Array.isArray(result) ? result : 
                      (result && result.data ? result.data : []);
      
      console.log("Processed data:", careData);
      setCustomerCare(careData);
  
      // Calculate statistics
      const totalCount = careData.length;
      const activeCount = careData.filter((cc: {available_for_work: boolean}) => cc.available_for_work).length;
      const bannedCount = careData.filter((cc: {available_for_work: boolean}) => !cc.available_for_work).length;
  
      setStats({
        total: totalCount,
        active: activeCount,
        banned: bannedCount,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomerCare([]);
      setStats({
        total: 0,
        active: 0,
        banned: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomerCare = async () => {
    setIsLoading(true); 
    try {
      const result = await customerCareService.createCustomerCareRepresentative();
      console.log("Generate result:", result); 
      
      if (result && result.EC === 0) {
        await fetchCustomerCare();
      } else {
        console.error("Failed to generate customer care rep:", result);
   
      }
    } catch (error) {
      console.error("Error generating customer care rep:", error);
 
    } finally {
      setIsLoading(false); 
    }
  };

  const table = useReactTable({
    data: customerCare,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
       {isLoading && <Spinner isVisible={isLoading} isOverlay />}
      <h1 className="text-2xl font-bold mb-4">Customer Care Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Representatives</h2>
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Representatives</h2>
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Banned Representatives</h2>
          <div className="text-3xl font-bold text-red-600">{stats.banned}</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="justify-between flex items-center">
          <h2 className="text-xl font-semibold mb-4">
            Customer Care Representatives
          </h2>
          <Button onClick={handleGenerateCustomerCare}>
            Generate Customer Care Representative
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
