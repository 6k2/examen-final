import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Lista de Items" }}
      />
      <Stack.Screen
        name="form"
        options={{ title: "Formulario de Item" }}
      />
    </Stack>
  );
}