import React from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors, spacing, typography } from "../theme"
import { Icon } from "../components"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TextStyle, ViewStyle } from "react-native"
import { DriverHomeScreen } from "../screens/DriverHomeScreen"
import { DriverSettingsScreen } from "../screens/DriverSettingsScreen"
import { CompositeScreenProps } from "@react-navigation/core"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs/lib/typescript/src/types"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type DriverTapParamList = {
  DriverSettings: undefined
  DriverHome: undefined
}
export type DriverTabScreenProps<T extends keyof DriverTapParamList> = CompositeScreenProps<
  BottomTabScreenProps<DriverTapParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>
const Tab = createBottomTabNavigator<DriverTapParamList>()

// const Stack = createStackNavigator<DriverNavigatorParamList>()
export const DriverNavigator = () => {
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
        name="DriverHome"
        component={DriverHomeScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Icon icon="home2" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DriverSettings"
        component={DriverSettingsScreen}
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
