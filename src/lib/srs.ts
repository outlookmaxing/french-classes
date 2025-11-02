export const SRS_INTERVALS = [1, 3, 7, 14, 30];

export function calculateNextReview(bucket: number): Date {
  const now = new Date();
  const daysToAdd = bucket < SRS_INTERVALS.length ? SRS_INTERVALS[bucket] : 30;

  now.setDate(now.getDate() + daysToAdd);
  return now;
}

export function getNextBucket(currentBucket: number, success: boolean): number {
  if (success) {
    return Math.min(currentBucket + 1, SRS_INTERVALS.length - 1);
  } else {
    return Math.max(0, currentBucket - 1);
  }
}

export function calculateStars(bucket: number): number {
  if (bucket === 0) return 1;
  if (bucket === 1) return 2;
  if (bucket === 2) return 3;
  if (bucket === 3) return 4;
  return 5;
}

export function isDueForReview(nextReviewAt: string): boolean {
  return new Date(nextReviewAt) <= new Date();
}
