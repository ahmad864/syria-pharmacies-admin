import type { Permission, Role } from "@/types/roles";

export const MOCK_PERMISSIONS: Permission[] = [
  { id: 1, slug: "pharmacies.view", label: "ط·آ¹ط·آ±ط·آ¶ ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾", group: "ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾" },
  { id: 2, slug: "pharmacies.edit", label: "ط·ع¾ط·آ¹ط·آ¯ط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾", group: "ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾" },
  { id: 3, slug: "pharmacies.approve", label: "ط¸â€ڑط·آ¨ط¸ث†ط¸â€‍ ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾", group: "ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾" },
  { id: 4, slug: "pharmacies.reject", label: "ط·آ±ط¸ظ¾ط·آ¶ ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾", group: "ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾" },
  { id: 5, slug: "users.manage", label: "ط·آ¥ط·آ¯ط·آ§ط·آ±ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ³ط·ع¾ط·آ®ط·آ¯ط¸â€¦ط¸ظ¹ط¸â€ ", group: "ط·آ§ط¸â€‍ط¸â€¦ط·آ³ط·ع¾ط·آ®ط·آ¯ط¸â€¦ط¸ث†ط¸â€ " },
  { id: 6, slug: "ads.manage", label: "ط·آ¥ط·آ¯ط·آ§ط·آ±ط·آ© ط·آ§ط¸â€‍ط·آ¥ط·آ¹ط¸â€‍ط·آ§ط¸â€ ط·آ§ط·ع¾", group: "ط·آ§ط¸â€‍ط·ع¾ط¸ث†ط·آ§ط·آµط¸â€‍" },
  { id: 7, slug: "notifications.manage", label: "ط·آ¥ط·آ¯ط·آ§ط·آ±ط·آ© ط·آ§ط¸â€‍ط·آ¥ط·آ´ط·آ¹ط·آ§ط·آ±ط·آ§ط·ع¾", group: "ط·آ§ط¸â€‍ط·ع¾ط¸ث†ط·آ§ط·آµط¸â€‍" },
  { id: 8, slug: "reports.view", label: "ط·آ¹ط·آ±ط·آ¶ ط·آ§ط¸â€‍ط·ع¾ط¸â€ڑط·آ§ط·آ±ط¸ظ¹ط·آ±", group: "ط·آ§ط¸â€‍ط·ع¾ط¸â€ڑط·آ§ط·آ±ط¸ظ¹ط·آ±" },
];

const permissionId = (slug: string): number => {
  const permission = MOCK_PERMISSIONS.find((item) => item.slug === slug);

  if (!permission) {
    throw new Error(`Mock permission not found: ${slug}`);
  }

  return permission.id;
};

export const MOCK_ROLES: Role[] = [
  {
    id: "role-admin",
    name: "ط¸â€¦ط·آ¯ط¸ظ¹ط·آ± ط·آ¹ط·آ§ط¸â€¦",
    slug: "admin",
    description: "ط·آµط¸â€‍ط·آ§ط·آ­ط¸ظ¹ط·آ© ط¸ئ’ط·آ§ط¸â€¦ط¸â€‍ط·آ© ط·آ¹ط¸â€‍ط¸â€° ط·آ¬ط¸â€¦ط¸ظ¹ط·آ¹ ط·آ£ط·آ¬ط·آ²ط·آ§ط·طŒ ط·آ§ط¸â€‍ط¸â€ ط·آ¸ط·آ§ط¸â€¦.",
    usersCount: 2,
    permissionIds: MOCK_PERMISSIONS.map((p) => p.id),
    isSystem: true,
  },
  {
    id: "role-moderator",
    name: "ط¸â€¦ط·آ´ط·آ±ط¸ظ¾ ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ©",
    slug: "moderator",
    description: "ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ© ط¸ث†ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط·آ§ط¸ظ¾ط¸â€ڑط·آ© ط·آ¹ط¸â€‍ط¸â€° ط·آ·ط¸â€‍ط·آ¨ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط·آµط¸ظ¹ط·آ¯ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾.",
    usersCount: 4,
    permissionIds: [
      permissionId("pharmacies.view"),
      permissionId("pharmacies.approve"),
      permissionId("pharmacies.reject"),
    ],
    isSystem: false,
  },
  {
    id: "role-manager",
    name: "ط¸â€¦ط·آ¯ط¸ظ¹ط·آ± ط¸â€¦ط·آ­ط·ع¾ط¸ث†ط¸â€°",
    slug: "manager",
    description: "ط·آ¥ط·آ¯ط·آ§ط·آ±ط·آ© ط·آ§ط¸â€‍ط·آ¥ط·آ¹ط¸â€‍ط·آ§ط¸â€ ط·آ§ط·ع¾ ط¸ث†ط·آ§ط¸â€‍ط·آ¥ط·آ´ط·آ¹ط·آ§ط·آ±ط·آ§ط·ع¾ ط¸ث†ط·آ§ط¸â€‍ط·ع¾ط¸â€ڑط·آ§ط·آ±ط¸ظ¹ط·آ±.",
    usersCount: 3,
    permissionIds: [
      permissionId("ads.manage"),
      permissionId("notifications.manage"),
      permissionId("reports.view"),
    ],
    isSystem: false,
  },
];