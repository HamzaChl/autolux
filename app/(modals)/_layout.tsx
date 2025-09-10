// app/(modals)/_layout.tsx
import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "transparentModal",
        contentStyle: { backgroundColor: "rgba(255,255,255,0.0)" },
        headerShown: false,
      }}
    />
  );
}
