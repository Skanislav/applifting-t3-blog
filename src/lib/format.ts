export function formatDate(date: Date): string | undefined {
  return date.toLocaleString("en-GB", { timeZone: "UTC" }).split(",")[0];
}

export function formatRelativeTime(date: Date) {
  const now = new Date();

  const timeDiff = Math.abs(now.getTime() - date.getTime());
  const secondsDiff = Math.floor(timeDiff / 1000);

  if (secondsDiff < 60) {
    return `few seconds ago`;
  }

  const minutesDiff = Math.floor(secondsDiff / 60);
  if (minutesDiff === 1) {
    return `A minute ago`;
  }
  if (minutesDiff < 60) {
    return `${minutesDiff} minutes ago`;
  }

  const hoursDiff = Math.floor(minutesDiff / 60);
  if (hoursDiff === 1) {
    return `An hour ago`;
  }
  if (hoursDiff < 24) {
    return `${hoursDiff} hours ago`;
  }

  const daysDiff = Math.floor(hoursDiff / 24);
  if (daysDiff === 1) {
    return "Yesterday";
  }

  return formatDate(date);
}
