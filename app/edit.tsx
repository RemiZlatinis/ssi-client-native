import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "@/components/buttons/AppButton";
import AppScreen from "@/components/containers/AppScreen";
import TextInput from "@/components/texts/AppTextInput";

import api from "@/api";
import { Agent } from "@/types";

export default function EditAgentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [agentName, setAgentName] = useState("");
  const [gracePeriod, setGracePeriod] = useState(30);
  const [saving, setSaving] = useState(false);

  // Fetch agent data on mount
  useEffect(() => {
    const loadAgent = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await api.agents.getAgent(id);

        if (data) {
          setAgent(data);
          setAgentName(data.name);
          setGracePeriod(data.grace_period);
        } else {
          setError("Agent not found");
        }
      } catch (err) {
        console.error("[EditAgent] Error fetching agent:", err);
        setError("Failed to load agent details");
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [id]);

  const fetchAgent = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.agents.getAgent(id);

      if (data) {
        setAgent(data);
        setAgentName(data.name);
        setGracePeriod(data.grace_period);
      } else {
        setError("Agent not found");
      }
    } catch (err) {
      console.error("[EditAgent] Error fetching agent:", err);
      setError("Failed to load agent details");
    } finally {
      setLoading(false);
    }
  };

  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async () => {
    if (!agentName.trim()) {
      Alert.alert("Validation Error", "Agent name cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await api.agents.updateAgent(id, {
        name: agentName,
        grace_period: gracePeriod,
      });
      router.replace("/");
    } catch (err) {
      console.error("[EditAgent] Error updating agent:", err);
      Alert.alert("Error", "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    const message =
      "Are you sure you want to remove this agent? This action is permanent and cannot be undone.";

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        performDelete();
      }
    } else {
      Alert.alert("Remove Agent", message, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: performDelete,
        },
      ]);
    }
  };

  const performDelete = async () => {
    setDeleting(true);
    try {
      await api.agents.deleteAgent(id);
      router.replace("/");
    } catch (err) {
      console.error("[EditAgent] Error deleting agent:", err);
      Alert.alert("Error", "Failed to remove agent. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const adjustGracePeriod = (delta: number) => {
    setGracePeriod((prev) => {
      const newValue = prev + delta;
      return Math.max(0, Math.min(300, newValue));
    });
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <AppScreen style={styles.container}>
        <Text style={styles.title}>Edit Agent</Text>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <EvilIcons name="close" size={32} color="#E8F2F7" />
        </Pressable>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#37A9E1" />
          <Text style={styles.loadingText}>Loading agent details...</Text>
        </View>
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen style={styles.container}>
        <Text style={styles.title}>Edit Agent</Text>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <EvilIcons name="close" size={32} color="#E8F2F7" />
        </Pressable>
        <View style={styles.centerContent}>
          <EvilIcons name="exclamation" size={48} color="#e18484" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchAgent}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={styles.container}>
      <Text style={styles.title}>Edit Agent</Text>
      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <EvilIcons name="close" size={32} color="#E8F2F7" />
      </Pressable>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Agent Name Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  textInputProps={{
                    value: agentName,
                    onChangeText: setAgentName,
                    placeholder: "Enter agent name",
                    autoFocus: false,
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Grace Period Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Grace Period</Text>
              <Text style={styles.currentValue}>{formatTime(gracePeriod)}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Wait time before marking agent as disconnected
            </Text>

            {/* Slider Control */}
            <View style={styles.controlRow}>
              <Pressable
                style={styles.controlButton}
                onPress={() => adjustGracePeriod(-5)}
                disabled={gracePeriod <= 0}
              >
                <Text
                  style={[
                    styles.controlButtonText,
                    gracePeriod <= 0 && styles.controlButtonDisabled,
                  ]}
                >
                  −
                </Text>
              </Pressable>

              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${(gracePeriod / 300) * 100}%` },
                  ]}
                />
              </View>

              <Pressable
                style={styles.controlButton}
                onPress={() => adjustGracePeriod(5)}
                disabled={gracePeriod >= 300}
              >
                <Text
                  style={[
                    styles.controlButtonText,
                    gracePeriod >= 300 && styles.controlButtonDisabled,
                  ]}
                >
                  +
                </Text>
              </Pressable>
            </View>

            {/* Range Labels */}
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>0s (immediate)</Text>
              <Text style={styles.rangeLabel}>300s (5 min)</Text>
            </View>

            {/* Quick Presets */}
            <View style={styles.presetsRow}>
              {[0, 30, 60, 120, 300].map((value) => (
                <Pressable
                  key={value}
                  style={[
                    styles.presetPill,
                    gracePeriod === value && styles.presetPillActive,
                  ]}
                  onPress={() => setGracePeriod(value)}
                >
                  <Text
                    style={[
                      styles.presetPillText,
                      gracePeriod === value && styles.presetPillTextActive,
                    ]}
                  >
                    {formatTime(value)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.separator} />

          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleUpdate}
            disabled={saving || deleting || !agentName.trim()}
            style={styles.saveButton}
          />

          <Pressable
            style={[
              styles.deleteButton,
              (saving || deleting) && styles.deleteButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={saving || deleting}
          >
            <Text style={styles.deleteButtonText}>
              {deleting ? "Removing..." : "Remove Agent"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    color: "#37A9E1",
    fontFamily: "Poppins-ExtraLight",
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: "#e18484",
    fontFamily: "Poppins-ExtraLight",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#185E81",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#E8F2F7",
    fontFamily: "BrunoAce",
    fontSize: 14,
  },
  title: {
    marginVertical: 20,
    fontSize: 20,
    fontFamily: "BrunoAce",
    textAlign: "center",
    color: "#E8F2F7",
  },
  closeButton: {
    position: "absolute",
    top: (StatusBar.currentHeight || 0) + 15,
    right: 20,
    padding: 4,
    zIndex: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginVertical: 20,
    alignSelf: Platform.OS === "web" ? "center" : undefined,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  sectionTitle: {
    color: "#E8F2F7",
    fontFamily: "BrunoAce",
    fontSize: 16,
  },
  editHint: {
    color: "#37A9E1",
    fontFamily: "Poppins-ExtraLight",
    fontSize: 12,
  },
  currentValue: {
    color: "#37A9E1",
    fontFamily: "BrunoAce",
    fontSize: 14,
  },
  sectionDescription: {
    color: "#8BA8B8",
    fontFamily: "Poppins-ExtraLight",
    fontSize: 13,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  separator: {
    marginVertical: 16,
    height: 1,
    backgroundColor: "#185E81",
    alignSelf: "center",
    opacity: 0.3,
    width: "60%",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#185E81",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonText: {
    color: "#E8F2F7",
    fontSize: 24,
    fontFamily: "BrunoAce",
    lineHeight: 28,
  },
  controlButtonDisabled: {
    color: "#4A6B7C",
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(24, 94, 129, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#37A9E1",
    borderRadius: 4,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rangeLabel: {
    color: "#5A8BA0",
    fontFamily: "Poppins-ExtraLight",
    fontSize: 11,
  },
  presetsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  presetPill: {
    backgroundColor: "rgba(24, 94, 129, 0.2)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(24, 94, 129, 0.4)",
  },
  presetPillActive: {
    backgroundColor: "#37A9E1",
    borderColor: "#37A9E1",
  },
  presetPillText: {
    color: "#E8F2F7",
    fontFamily: "BrunoAce",
    fontSize: 11,
  },
  presetPillTextActive: {
    color: "#FFFFFF",
  },
  saveButton: {
    marginTop: 20,
  },
  deleteButton: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: "#e18484",
    borderWidth: 1.5,
    borderRadius: 30,
    height: Platform.OS === "web" ? 40 : 60,
    justifyContent: "center",
    maxWidth: Platform.OS === "web" ? 300 : undefined,
    width: "100%",
    marginTop: 16,
    backgroundColor: "rgba(225, 132, 132, 0.08)",
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: "#e18484",
    fontFamily: "BrunoAce",
    fontSize: Platform.OS === "web" ? 16 : 24,
    textAlign: "center",
  },
});
