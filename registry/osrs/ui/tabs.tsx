"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col", className)} {...props} />;
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn("osrs-tabs-list", className)} {...props} />;
}

const sizes = { small: "", medium: "osrs-tab-medium", large: "osrs-tab-large" } as const;

function TabsTrigger({ className, size = "small", ...props }: TabsPrimitive.Tab.Props & { size?: keyof typeof sizes }) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn("osrs-tab osrs-framed osrs-text", sizes[size], className)}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
