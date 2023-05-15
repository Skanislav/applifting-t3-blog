export function formatDate(date: Date): string | undefined {
  return date.toLocaleString("en-GB", { timeZone: "UTC" }).split(",")[0];
}
