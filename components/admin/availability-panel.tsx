import { WeeklyHoursEditor } from "@/components/admin/weekly-hours-editor";
import { BookingSettingsEditor } from "@/components/admin/booking-settings-editor";
import { TimeOffEditor } from "@/components/admin/time-off-editor";
import { CalendarSubscription } from "@/components/admin/calendar-subscription";
import type { Toast } from "@/components/admin/admin-toast";

interface AvailabilityPanelProps {
  notify: (tone: Toast["tone"], message: string) => void;
}

export const AvailabilityPanel = ({ notify }: AvailabilityPanelProps) => (
  <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
    <WeeklyHoursEditor notify={notify} />
    <div className="grid content-start gap-10">
      <CalendarSubscription notify={notify} />
      <BookingSettingsEditor notify={notify} />
      <TimeOffEditor notify={notify} />
    </div>
  </div>
);
