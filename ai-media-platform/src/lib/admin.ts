export const ADMIN_USER_IDS = [
  "7e633eb3-2140-4457-b44d-610c1e9293a5",
];

export function isAdminUser(userId: string | undefined | null): boolean {
  if (!userId) return false;
  return ADMIN_USER_IDS.includes(userId);
}
