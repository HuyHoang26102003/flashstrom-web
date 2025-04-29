"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useCustomerCareStore } from "@/stores/customerCareStore";
import { inquiryService } from "@/services/customer-cares/inquiryService";
import { Spinner } from "./Spinner";
import { ApiResponse } from "@/types/common";
import {
  ENUM_INQUIRY_PRIORITY,
  ENUM_INQUIRY_STATUS,
  Inquiry,
} from "@/types/inquiries";
import { formatEpochToRelativeTime } from "@/utils/functions/formatRelativeTime";

const DashboardCustomerCare = () => {
  const [priorityFilter, setPriorityFilter] = useState<ENUM_INQUIRY_PRIORITY>(
    ENUM_INQUIRY_PRIORITY.HIGH
  );
  const [statusFilter, setStatusFilter] = useState<ENUM_INQUIRY_STATUS>(
    ENUM_INQUIRY_STATUS.OPEN
  );
  const customerCareZ = useCustomerCareStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [assignedInquiries, setAssignedInquiries] = useState<Inquiry[] | null>(
    null
  );

  // Function to get status color
  const getStatusColor = (status: ENUM_INQUIRY_STATUS) => {
    switch (status) {
      case ENUM_INQUIRY_STATUS.OPEN:
        return "bg-blue-500";
      case ENUM_INQUIRY_STATUS.IN_PROGRESS:
        return "bg-orange-400";
      case ENUM_INQUIRY_STATUS.RESOLVED:
        return "bg-green-500";
      case ENUM_INQUIRY_STATUS.ESCALATE:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority: ENUM_INQUIRY_PRIORITY) => {
    switch (priority) {
      case ENUM_INQUIRY_PRIORITY.HIGH:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (customerCareZ && customerCareZ.id) {
      inquiryService
        .getAllInquiries(customerCareZ.id)
        .then((response: ApiResponse<Inquiry[]>) => {
          if (response.EC === 0) {
            setAssignedInquiries(response.data);
          }
        })
        .catch((e) => {
          console.log("error", e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [customerCareZ]);
  console.log("cehck data", assignedInquiries);

  if (isLoading) {
    return <Spinner isVisible isOverlay />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <Input
          placeholder="Search for ticket"
          className="w-1/3 bg-white border"
        />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40 bg-white border">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ENUM_INQUIRY_PRIORITY.URGENT}>Urgent</SelectItem>
            <SelectItem value={ENUM_INQUIRY_PRIORITY.HIGH}>High</SelectItem>
            <SelectItem value={ENUM_INQUIRY_PRIORITY.MEDIUM}>Medium</SelectItem>
            <SelectItem value={ENUM_INQUIRY_PRIORITY.LOW}>Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-white border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ENUM_INQUIRY_STATUS.OPEN}>Open</SelectItem>
            <SelectItem value={ENUM_INQUIRY_STATUS.IN_PROGRESS}>
              In Progress
            </SelectItem>
            <SelectItem value={ENUM_INQUIRY_STATUS.CLOSED}>Closed</SelectItem>
            <SelectItem value={ENUM_INQUIRY_STATUS.ESCALATE}>
              Escalate
            </SelectItem>
          </SelectContent>
        </Select>
        <Button>New Ticket</Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="All Tickets" className="mb-4">
        <TabsList>
          <TabsTrigger value="All Tickets">All Tickets</TabsTrigger>
          <TabsTrigger value="New">New</TabsTrigger>
          <TabsTrigger value="On-Going">On-Going</TabsTrigger>
          <TabsTrigger value="Resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ticket List */}
      <div className="space-y-4">
        {assignedInquiries?.map((ticket, index) => (
          <Card
            key={index}
            className={`border ${
              ticket.priority === ENUM_INQUIRY_PRIORITY.HIGH
                ? "border-blue-500 border-2"
                : ""
            }`}
          >
            <div className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center flex-col space-x-2">
                  <div className="flex-row flex gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${getStatusColor(
                        ticket.status
                      )}`}
                    ></div>
                    <CardTitle className="text-sm font-medium">
                      Ticket #{ticket.id}
                    </CardTitle>
                    {ticket.priority === "HIGH" && (
                      <Badge className={getPriorityColor(ticket.priority)}>
                        High Priority
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-start w-full text-gray-500">
                    {formatEpochToRelativeTime(ticket.created_at)}{" "}
                    {formatEpochToRelativeTime(ticket.created_at) === "Just now"
                      ? null
                      : "ago"}
                  </span>
                </div>
              </CardHeader>
            </div>

            <CardContent>
              <h3 className="font-semibold">{ticket.subject}</h3>
              <p className="text-sm text-gray-600">{ticket.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={ticket?.customer?.avatar?.url}
                      alt={ticket.customer.first_name.slice(0, 1)}
                    />
                    <AvatarFallback>
                      {ticket.customer.first_name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {ticket.customer.last_name} {ticket.customer.first_name}
                  </span>
                </div>
                <Button variant="outline">Open Ticket</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <Button variant="outline">Previous</Button>
        <Button variant="outline" className=" text-white bg-primary">
          1
        </Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
};

export default DashboardCustomerCare;
