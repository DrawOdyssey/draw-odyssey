// Admin user IDs - only these users can access the admin dashboard
export const ADMIN_USER_IDS = [
  "7e633eb3-2140-4457-b44d-610c1e9293a5", // Admin@drawodyssey.com
];

export function isAdminUser(userId: string | undefined | null): boolean {
  if (!userId) return false;
  return ADMIN_USER_IDS.includes(userId);
}
```

6. Click **Commit changes**

**File 2: Update** `ai-media-platform/src/components/layout/AppShell.tsx`

1. Find this block near the top:
```
const accountNav = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];
```

2. Replace it with:
```
const accountNav = [
  { href: "/profile", label: "My Profile", icon: User },
];

const adminNav = [
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];
```

3. Then find this line in the imports area and add the new imports. Find:
```
import { useState, useEffect } from "react";
```

Replace with:
```
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { isAdminUser } from "@/lib/admin";
```

4. Then find this inside the component function:
```
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
```

Replace with:
```
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppStore((s) => s.user);
```

5. Then find this in the nav rendering:
```
          <SectionLabel label="Account" />
          {accountNav.map((item) => <NavLink key={item.href} {...item} />)}
```

Replace with:
```
          <SectionLabel label="Account" />
          {accountNav.map((item) => <NavLink key={item.href} {...item} />)}
          {isAdminUser(user?.id) && adminNav.map((item) => <NavLink key={item.href} {...item} />)}
```

6. Commit changes.

**File 3: Update** `ai-media-platform/src/app/admin/page.tsx`

Add an admin guard at the top of the page. Find:
```
"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
```

Replace with:
```
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAppStore } from "@/lib/store";
import { isAdminUser } from "@/lib/admin";
```

Then find the start of the component function:
```
export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
```

Replace with:
```
export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const user = useAppStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && !isAdminUser(user.id)) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || !isAdminUser(user.id)) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-surface-400">Access denied. Admin only.</p>
        </div>
      </AppShell>
    );
  }
