import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function CameraScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");

  useEffect(() => {
    if (isRecording) {
      const id = setInterval(() => setTimer((t) => t + 1), 1000);
      setIntervalId(id);
    } else {
      if (intervalId) clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setIsRecording(true);
    setTimer(0);
    console.log("Recording started");
  };

  const stopRecording = async () => {
    setIsRecording(false);
    // Simulate saving video
    const fileName = `video_${Date.now()}.mp4`;
    const destPath = `${FileSystem.documentDirectory}${fileName}`;
    console.log("Recording stopped and saved to:", destPath);

    // Navigate to gallery tab to show the new video
    navigation.navigate("Gallery" as never);
  };

  const flipCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Format timer as mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.overlay}>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                isRecording ? styles.buttonStop : styles.buttonStart,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.buttonText}>
                {isRecording ? "Stop" : "Record"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.flipButton]}
              onPress={flipCamera}
            >
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  timer: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  button: {
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 8,
  },
  buttonStart: {
    backgroundColor: "#1abc9c",
  },
  buttonStop: {
    backgroundColor: "#e74c3c",
  },
  flipButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
