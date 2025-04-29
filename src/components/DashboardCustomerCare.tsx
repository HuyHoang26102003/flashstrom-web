"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { ArrowLeft } from "lucide-react";

const DashboardCustomerCare = () => {
  const customerCareZ = useCustomerCareStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [assignedInquiries, setAssignedInquiries] = useState<Inquiry[] | null>(
    null
  );
  const [selectedInquiryDetails, setSelectedInquiryDetails] =
    useState<Inquiry | null>(null);

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

  if (isLoading) {
    return <Spinner isVisible isOverlay />;
  }

  return (
    <div className="py-6 w-full mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>

      {/* Conditional Rendering */}
      {selectedInquiryDetails ? (
        <InquiryDetails
          inquiry={selectedInquiryDetails}
          onBack={() => setSelectedInquiryDetails(null)}
        />
      ) : (
        <ListInquiries
          setSelectedInquiryDetails={setSelectedInquiryDetails}
          assignedInquiries={assignedInquiries}
        />
      )}
    </div>
  );
};

export default DashboardCustomerCare;

const ListInquiries = ({
  assignedInquiries,
  setSelectedInquiryDetails,
}: {
  assignedInquiries: Inquiry[] | null;
  setSelectedInquiryDetails: Dispatch<SetStateAction<Inquiry | null>>;
}) => {
  const [priorityFilter, setPriorityFilter] = useState<ENUM_INQUIRY_PRIORITY>(
    ENUM_INQUIRY_PRIORITY.HIGH
  );
  const [statusFilter, setStatusFilter] = useState<ENUM_INQUIRY_STATUS>(
    ENUM_INQUIRY_STATUS.OPEN
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
  return (
    <>
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
                <Button
                  onClick={() => setSelectedInquiryDetails(ticket)}
                  variant="outline"
                >
                  Open Ticket
                </Button>
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
    </>
  );
};

const InquiryDetails = ({
  inquiry,
  onBack,
}: {
  inquiry: Inquiry;
  onBack: () => void;
}) => {
  const [status, setStatus] = useState<ENUM_INQUIRY_STATUS>(inquiry.status);
  const [priority, setPriority] = useState<ENUM_INQUIRY_PRIORITY>(
    inquiry.priority
  );
  const [issueType, setIssueType] = useState<string>(
    inquiry.issue_type || "OTHER"
  );
  const [resolutionType, setResolutionType] = useState<string>(
    inquiry.resolution_type || ""
  );
  const [resolutionNotes, setResolutionNotes] = useState<string>(
    inquiry.resolution_notes || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Here you would call your API to update the inquiry
      // await inquiryService.updateInquiry(inquiry.id, {
      //   status,
      //   priority,
      //   issue_type: issueType,
      //   resolution_type: resolutionType,
      //   resolution_notes: resolutionNotes
      // });
      console.log("Saving changes...");
    } catch (error) {
      console.error("Error updating inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tickets
        </Button>
        <h2 className="text-xl font-semibold">Ticket #{inquiry.id}</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${getStatusColor(status)}`}
            ></div>
            <CardTitle className="text-lg">Ticket Details</CardTitle>
            {priority === ENUM_INQUIRY_PRIORITY.HIGH && (
              <Badge className={getPriorityColor(priority)}>
                High Priority
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Created: {formatEpochToRelativeTime(inquiry.created_at)} ago
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left side - Basic Information */}
            <div className="col-span-2 space-y-6">
              <h3 className="font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as ENUM_INQUIRY_STATUS)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ENUM_INQUIRY_STATUS.OPEN}>
                        Open
                      </SelectItem>
                      <SelectItem value={ENUM_INQUIRY_STATUS.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={ENUM_INQUIRY_STATUS.RESOLVED}>
                        Resolved
                      </SelectItem>
                      <SelectItem value={ENUM_INQUIRY_STATUS.CLOSED}>
                        Closed
                      </SelectItem>
                      <SelectItem value={ENUM_INQUIRY_STATUS.ESCALATE}>
                        Escalate
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={priority}
                    onValueChange={(value) =>
                      setPriority(value as ENUM_INQUIRY_PRIORITY)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ENUM_INQUIRY_PRIORITY.URGENT}>
                        Urgent
                      </SelectItem>
                      <SelectItem value={ENUM_INQUIRY_PRIORITY.HIGH}>
                        High
                      </SelectItem>
                      <SelectItem value={ENUM_INQUIRY_PRIORITY.MEDIUM}>
                        Medium
                      </SelectItem>
                      <SelectItem value={ENUM_INQUIRY_PRIORITY.LOW}>
                        Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Issue Type</label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Issue Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACCOUNT">Account</SelectItem>
                      <SelectItem value="PAYMENT">Payment</SelectItem>
                      <SelectItem value="PRODUCT">Product</SelectItem>
                      <SelectItem value="DELIVERY">Delivery</SelectItem>
                      <SelectItem value="REFUND">Refund</SelectItem>
                      <SelectItem value="TECHNICAL">Technical</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Resolution Type</label>
                  <Select
                    value={resolutionType}
                    onValueChange={setResolutionType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Resolution Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REFUND">Refund</SelectItem>
                      <SelectItem value="REPLACEMENT">Replacement</SelectItem>
                      <SelectItem value="INVESTIGATING">
                        Investigating
                      </SelectItem>
                      <SelectItem value="ACCOUNT_FIX">Account Fix</SelectItem>
                      <SelectItem value="TECHNICAL_SUPPORT">
                        Technical Support
                      </SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right side - Customer Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Customer Information</h3>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src={inquiry?.customer?.avatar?.url}
                    alt={inquiry.customer.first_name.slice(0, 1)}
                  />
                  <AvatarFallback>
                    {inquiry.customer.first_name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {inquiry.customer.last_name} {inquiry.customer.first_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Customer ID: {inquiry.customer_id}
                  </div>
                </div>
              </div>

              {inquiry.order && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Related Order</h4>
                  <div className="text-sm">Order ID: {inquiry.order.id}</div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Timeline</h4>
                <div className="text-sm space-y-1">
                  <div>
                    Created: {formatEpochToRelativeTime(inquiry.created_at)} ago
                  </div>
                  {inquiry.first_response_at && (
                    <div>
                      First Response:{" "}
                      {formatEpochToRelativeTime(inquiry.first_response_at)} ago
                    </div>
                  )}
                  {inquiry.last_response_at && (
                    <div>
                      Last Response:{" "}
                      {formatEpochToRelativeTime(inquiry.last_response_at)} ago
                    </div>
                  )}
                  {inquiry.resolved_at && (
                    <div>
                      Resolved: {formatEpochToRelativeTime(inquiry.resolved_at)}{" "}
                      ago
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Content */}
          <div className="space-y-4">
            <h3 className="font-medium">Ticket Content</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <div className="p-3 bg-gray-50 rounded-md">{inquiry.subject}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <div className="p-3 bg-gray-50 rounded-md">
                {inquiry.description}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes</label>
              <textarea
                className="w-full p-3 border rounded-md"
                rows={4}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add resolution notes..."
              />
            </div>
          </div>

          {/* History Information */}
          {(inquiry.escalation_history?.length > 0 ||
            inquiry.rejection_history?.length > 0 ||
            inquiry.transfer_history?.length > 0) && (
            <div className="space-y-4">
              <h3 className="font-medium">History</h3>

              {inquiry.escalation_history?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Escalation History</h4>
                  <div className="space-y-2">
                    {inquiry.escalation_history.map((escalation, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-md text-sm"
                      >
                        <div className="font-medium">
                          Escalated to: {escalation.escalated_to}
                        </div>
                        <div>Reason: {escalation.reason}</div>
                        <div className="text-gray-500">
                          {formatEpochToRelativeTime(escalation.timestamp)} ago
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inquiry.rejection_history?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Rejection History</h4>
                  <div className="space-y-2">
                    {inquiry.rejection_history.map((rejection, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-md text-sm"
                      >
                        <div>Reason: {rejection.reason}</div>
                        <div className="text-gray-500">
                          {formatEpochToRelativeTime(rejection.timestamp)} ago
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inquiry.transfer_history?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Transfer History</h4>
                  <div className="space-y-2">
                    {inquiry.transfer_history.map((transfer, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-md text-sm"
                      >
                        <div>From: {transfer.from_customer_care_id}</div>
                        <div>To: {transfer.to_customer_care_id}</div>
                        <div>Reason: {transfer.reason}</div>
                        <div className="text-gray-500">
                          {formatEpochToRelativeTime(transfer.timestamp)} ago
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
