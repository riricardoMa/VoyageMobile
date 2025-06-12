import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../services/auth/useAuth";

export default function WelcomeScreen() {
  const { session, signOut, loading } = useAuth();
  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{session?.user?.email}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  email: {
    fontSize: 18,
    marginBottom: 32,
  },
});
