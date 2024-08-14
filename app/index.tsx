import { registerRootComponent } from "expo";
import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SwipeListScreen from "./screens/SwipeListScreen";
import {
  Box,
  Center,
  extendTheme,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from "native-base";

const Drawer = createDrawerNavigator();
import { useTheme } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CreatorScreen from "./screens/CreatorScreen";

const getIcon = (screenName: string) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Settings":
      return "animation";
    case "SwipeList":
      return "airplane";
    case "Creator":
      return "coffee-maker";
  }
};

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <Center>
        <Heading color={"secondary.500"}>Menu</Heading>
      </Center>
      <VStack my={2} mx={1} space={5}>
        {props.state.routeNames.map((name: string, index: number) => (
          <Pressable
            key={index}
            px={5}
            py={3}
            onPress={(event) => props.navigation.navigate(name)}
            rounded="md"
            bg={index === props.state.index ? "secondary.100" : "transparent"}
          >
            <HStack p={1} space={4} alignItems="center">
              <Icon
                size={5}
                color={
                  index === props.state.index ? "secondary.600" : "gray.700"
                }
                as={<MaterialCommunityIcons name={getIcon(name)} />}
              ></Icon>
              <Text
                fontWeight={500}
                color={
                  index === props.state.index ? "secondary.600" : "gray.700"
                }
              >
                {name}
              </Text>
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </DrawerContentScrollView>
  );
};

export default function index() {
  const theme = useTheme();
  const headerStyle = {
    headerStyle: {
      backgroundColor: theme.colors.secondary[600],
    },
    headerTintColor: "#fff",
  };

  return (
    <>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "My Home",
            ...headerStyle,
          }}
        />
        <Drawer.Screen
          name="Creator"
          component={CreatorScreen}
          options={{
            title: "Creator",
            ...headerStyle,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            ...headerStyle,
          }}
        />
        <Drawer.Screen
          name="SwipeList"
          component={SwipeListScreen}
          options={{
            ...headerStyle,
          }}
        />
      </Drawer.Navigator>
    </>
  );
}
