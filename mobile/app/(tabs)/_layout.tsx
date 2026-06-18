import { Tabs } from "expo-router";
import { View, Text } from "react-native";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    index: "⊕",
    cme: "✦",
    licenses: "⊞",
    profile: "◉",
  };
  return (
    <View className="items-center justify-center w-8 h-8">
      <Text style={{ fontSize: 18, color: focused ? "#1a56a0" : "#94a3b8" }}>
        {icons[name] ?? "●"}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
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
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cme"
        options={{
          title: "CME Wallet",
          tabBarIcon: ({ focused }) => <TabIcon name="cme" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="licenses"
        options={{
          title: "Licenses",
          tabBarIcon: ({ focused }) => <TabIcon name="licenses" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
