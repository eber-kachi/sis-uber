import React from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs/lib/typescript/src/types"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { CompositeScreenProps } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "../theme"
import { Icon } from "../components"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ClientHomeScreen } from "../screens/ClientHomeScreen"
import { ClientSettingsScreen } from "../screens/ClientSettingsScreen"
import { ClientSearchLocationScreen } from "../screens/ClientSearchLocationScreen"

export type ClientTabParamList = {
  ClientHome: undefined
  ClientSettings: undefined
  ClientSearchLocation: undefined
  ClientConfirmation: undefined
}

export type ClientTabScreenProps<T extends keyof ClientTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<ClientTabParamList>()

// const Stack = createStackNavigator<ClientNavigatorParamList>()

export const ClientNavigator = () => {
  const { bottom } = useSafeAreaInsets()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="ClientSearchLocation"
        component={ClientSearchLocationScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Icon icon="BrandgoogleMaps" color={focused && colors.tint} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Icon icon="BrandgoogleMaps" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="ClientSettings"
        component={ClientSettingsScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused && colors.tint} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.medium,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}
