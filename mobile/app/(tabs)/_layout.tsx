import { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getQueueCount } from "@/lib/offlineQueue";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  index:    { active: "home",          inactive: "home-outline" },
  cme:      { active: "document-text", inactive: "document-text-outline" },
  licenses: { active: "card",          inactive: "card-outline" },
  profile:  { active: "person-circle", inactive: "person-circle-outline" },
};

export default function TabsLayout() {
  const [cmeBadge, setCmeBadge] = useState<number | undefined>(undefined);

  useEffect(() => {
    function checkQueue() {
      getQueueCount().then((c) => setCmeBadge(c > 0 ? c : undefined));
    }
    checkQueue();
    const id = setInterval(checkQueue, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1a56a0",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e2e8f0",
          borderTopWidth: 1,
          paddingTop: 4,
          paddingBottom: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? TAB_ICONS.index.active : TAB_ICONS.index.inactive}
              size={22}
              color={focused ? "#1a56a0" : "#94a3b8"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cme"
        options={{
          title: "CME Wallet",
          tabBarBadge: cmeBadge,
          tabBarBadgeStyle: { backgroundColor: "#d97706", minWidth: 16, height: 16, fontSize: 10 },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? TAB_ICONS.cme.active : TAB_ICONS.cme.inactive}
              size={22}
              color={focused ? "#1a56a0" : "#94a3b8"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="licenses"
        options={{
          title: "Licenses",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? TAB_ICONS.licenses.active : TAB_ICONS.licenses.inactive}
              size={22}
              color={focused ? "#1a56a0" : "#94a3b8"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? TAB_ICONS.profile.active : TAB_ICONS.profile.inactive}
              size={22}
              color={focused ? "#1a56a0" : "#94a3b8"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
