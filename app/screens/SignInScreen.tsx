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

export default function SignInScreenProofOfConcept() {
  const { signInWithOtp, verifyOtp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    setMessage("");
    await signInWithOtp(email);
    setOtpSent(true);
    setMessage("Check your email for the 6-digit verification code.");
  };

  const handleVerifyOtp = async () => {
    setMessage("");
    await verifyOtp(email, otp);
    if (!error) {
      setMessage("Successfully signed in!");
    }
  };

  const handleResendOtp = async () => {
    setMessage("");
    setOtp("");
    await signInWithOtp(email);
    setMessage("New verification code sent to your email.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!otpSent ? (
        <>
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
            title="Send Verification Code"
            onPress={handleSendOtp}
            disabled={loading || !email}
          />
        </>
      ) : (
        <>
          <Text style={styles.emailText}>
            Verification code sent to: {email}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            editable={!loading}
          />
          <Button
            title="Verify Code"
            onPress={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
          />
          <View style={styles.divider} />
          <Button
            title="Resend Code"
            onPress={handleResendOtp}
            disabled={loading}
          />
          <Button
            title="Change Email"
            onPress={() => {
              setOtpSent(false);
              setOtp("");
              setMessage("");
            }}
            disabled={loading}
          />
        </>
      )}

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
  emailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
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
