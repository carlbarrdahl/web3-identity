import { formatDistance } from "date-fns";

export function fromToday(date: Date | string) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}
