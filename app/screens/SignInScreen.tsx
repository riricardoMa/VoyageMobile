import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../services/auth/useAuth";

export default function SignInScreen() {
  const { signInWithOtp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    setMessage("");
    await signInWithOtp(email);
    setOtpSent(true);
    setMessage("Check your email for the login link.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <Button
        title={otpSent ? "Resend Magic Link" : "Send Magic Link"}
        onPress={handleSendOtp}
        disabled={loading || !email}
      />
      <View style={styles.divider} />
      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  divider: {
    height: 24,
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    color: "green",
    marginTop: 16,
    textAlign: "center",
  },
});
