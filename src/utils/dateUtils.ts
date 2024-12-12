export function getStartDateForFilter(filterDate: string): Date | undefined {
  const currentDate = new Date();
  let startDate: Date | undefined;

  switch (filterDate) {
    case "today":
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Set to start of today
      break;
    case "last7days":
      startDate = new Date();
      startDate.setDate(currentDate.getDate() - 7); // 7 days ago
      break;
    case "last14days":
      startDate = new Date();
      startDate.setDate(currentDate.getDate() - 14); // 14 days ago
      break;
    case "last30days":
      startDate = new Date();
      startDate.setDate(currentDate.getDate() - 30); // 30 days ago
      break;
    case "30-60days":
      startDate = new Date();
      startDate.setDate(currentDate.getDate() - 60); // 60 days ago
      break;
    case ">60days":
      startDate = new Date(0); // Set to Unix epoch if more than 60 days ago
      break;
    default:
      throw new Error("Invalid filterDate");
  }

  return startDate;
}
