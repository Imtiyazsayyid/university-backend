export function getComparisonDate(dateRange) {
  const startDate = new Date(dateRange[0]).toISOString().split("T")[0] + "T00:00:00.000Z";
  const endDate = new Date(dateRange[1]).toISOString().split("T")[0] + "T23:59:59.999Z";

  return { startDate, endDate };
}
