"use client";

import { useActionState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { createService } from "~/actions/rentals";
import SubmitButton from "./SubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function NewRental() {
  const [state, formAction] = useActionState(createService, { message: "" });

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add a New Rental Service</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to list your service for customers.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.message && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            {state.message}
          </div>
        )}

        {/* Service Details */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Service Details</h2>

          <div className="space-y-2">
            <Label htmlFor="service-name">Service Name *</Label>
            <Input
              id="service-name"
              name="name"
              placeholder="e.g., 2024 Toyota Camry, Canon DSLR Kit, Conference Room A"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              name="description"
              placeholder="Describe your service in detail..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select name="category" required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="spaces">Spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-images">Service Images</Label>
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="text-center text-neutral-400">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm">Image upload coming soon</p>
                <p className="text-xs">Drag and drop or click to browse</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Add photos to showcase your service (optional)
            </p>
          </div>
        </div>

        {/* Pricing & Quantity */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Pricing & Quantity</h2>

          <div className="space-y-2">
            <Label htmlFor="cost-per-day">Daily Rate *</Label>
            <Input
              id="cost-per-day"
              name="costPerDay"
              type="text"
              placeholder="50.00"
              required
            />
            <p className="text-muted-foreground text-sm">
              Enter the daily rental rate in dollars (e.g., 50.00)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total-quantity">Total Quantity Available *</Label>
            <Input
              id="total-quantity"
              name="totalQuantity"
              type="number"
              min="1"
              defaultValue="1"
              placeholder="1"
              required
            />
            <p className="text-muted-foreground text-sm">
              How many units of this service are available for rent?
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <SubmitButton
            label="Create Service"
            className="bg-blue-500 px-8 text-white hover:bg-blue-600"
          />
        </div>
      </form>
    </div>
  );
}
