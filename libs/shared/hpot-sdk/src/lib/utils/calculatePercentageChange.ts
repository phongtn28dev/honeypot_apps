export function calculatePercentageChange(current: number, previous: number) {
  // Ensure the result is a valid number

  if (previous === 0 && current === 0) {
    return 0;
  } else if (previous === 0) {
    return current === 0 ? 0 : 100; // Assume 100% change for a significant increase
  } else if (current === 0) {
    return -100;
  }

  // Calculate percentage change
  if (current > previous) {
    return ((current - previous) / previous) * 100;
  } else {
    return (current / previous) * 100 - 100;
  }
}
