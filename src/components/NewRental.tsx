"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function NewRental() {
  const [openSections, setOpenSections] = useState({
    details: true,
    pricing: false,
    availability: false,
    media: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add a New Rental Service</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to list your service for customers.
        </p>
      </div>

      <form className="space-y-4">
        {/* Service Details Section */}
        <Collapsible
          open={openSections.details}
          onOpenChange={() => toggleSection("details")}
          className="bg-card rounded-lg border"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
            <h2 className="text-lg font-semibold">Service Details</h2>
            <ChevronDown
              className={`size-5 transition-transform ${
                openSections.details ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  placeholder="e.g., Professional DSLR Camera Kit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-description">Service Description</Label>
                <Textarea
                  id="service-description"
                  placeholder="Describe your service in detail..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="event-space">Event Space</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="party-equipment">
                      Party Equipment
                    </SelectItem>
                    <SelectItem value="water-sports">Water Sports</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="musical">Musical</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="watercraft">Watercraft</SelectItem>
                    <SelectItem value="transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="hobby">Hobby</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Pricing Section */}
        <Collapsible
          open={openSections.pricing}
          onOpenChange={() => toggleSection("pricing")}
          className="bg-card rounded-lg border"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <ChevronDown
              className={`size-5 transition-transform ${
                openSections.pricing ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily-rate">Daily Rate</Label>
                  <Input id="daily-rate" type="text" placeholder="$0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekend-rate">Weekend Rate</Label>
                  <Input id="weekend-rate" type="text" placeholder="$0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weekly-rate">Weekly Rate</Label>
                  <Input id="weekly-rate" type="text" placeholder="$0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-rate">Monthly Rate</Label>
                  <Input id="monthly-rate" type="text" placeholder="$0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Security Deposit</Label>
                <Input id="deposit" type="text" placeholder="$0.00" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Availability Section */}
        <Collapsible
          open={openSections.availability}
          onOpenChange={() => toggleSection("availability")}
          className="bg-card rounded-lg border"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
            <h2 className="text-lg font-semibold">Availability</h2>
            <ChevronDown
              className={`size-5 transition-transform ${
                openSections.availability ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="availability-status">Status</Label>
                <Select defaultValue="available">
                  <SelectTrigger id="availability-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="available-from">Available From</Label>
                  <Input id="available-from" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available-until">Available Until</Label>
                  <Input id="available-until" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., New York, NY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-rental">Minimum Rental Period</Label>
                <Select>
                  <SelectTrigger id="min-rental">
                    <SelectValue placeholder="Select minimum period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-day">1 Day</SelectItem>
                    <SelectItem value="2-days">2 Days</SelectItem>
                    <SelectItem value="3-days">3 Days</SelectItem>
                    <SelectItem value="1-week">1 Week</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Media Section */}
        <Collapsible
          open={openSections.media}
          onOpenChange={() => toggleSection("media")}
          className="bg-card rounded-lg border"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
            <h2 className="text-lg font-semibold">Media</h2>
            <ChevronDown
              className={`size-5 transition-transform ${
                openSections.media ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="images">Service Images</Label>
                <div className="border-muted-foreground/25 flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                      Drop images here or click to upload
                    </p>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("images")?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Upload up to 10 images. Recommended size: 1200x800px
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" variant="primary">
            Save and Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
