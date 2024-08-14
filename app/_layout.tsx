import { Slot } from "expo-router";
import { NativeBaseProvider, Box, extendTheme } from "native-base";

const theme = extendTheme({})
export default function RootLayout() {
    return (
        <NativeBaseProvider theme={theme}>
            <Slot />
        </NativeBaseProvider>
    )
}