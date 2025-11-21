import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { createItem, updateItem } from "../services/itemsService";

const defaultStudentId = "STU-0000";

export default function ItemFormScreen() {
  const router = useRouter();
  const {
    id,
    title: initialTitle,
    description: initialDescription,
    createdAt: createdAtParam,
    studentId: studentIdParam,
  } = useLocalSearchParams();

  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [studentId, setStudentId] = useState(defaultStudentId);

  useEffect(() => {
    if (isEditing) {
      setTitle(initialTitle?.toString() ?? "");
      setDescription(initialDescription?.toString() ?? "");
      setStudentId(studentIdParam?.toString() || defaultStudentId);
    }
  }, [isEditing, initialTitle, initialDescription, studentIdParam]);

  const createdAtLabel = (() => {
    if (!createdAtParam) return "";
    const ms = Number(createdAtParam);
    if (!Number.isFinite(ms)) return "";
    return new Date(ms).toLocaleString();
  })();

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert("Validación", "El título es obligatorio.");
      return;
    }
    const trimmedStudentId = studentId.trim();
    if (!trimmedStudentId) {
      Alert.alert("Validación", "El studentId es obligatorio.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await updateItem(id.toString(), {
          title: trimmedTitle,
          description,
          studentId: trimmedStudentId,
        });
      } else {
        await createItem({
          title: trimmedTitle,
          description,
          studentId: trimmedStudentId,
        });
      }

      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo guardar el item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          {isEditing ? (
            <View style={styles.meta}>
              {createdAtLabel ? (
                <Text style={styles.createdAt}>Añadido: {createdAtLabel}</Text>
              ) : null}
              <Text style={styles.createdAt}>Student ID: {studentId || "N/A"}</Text>
            </View>
          ) : (
            <View style={styles.studentField}>
              <Text style={styles.studentLabel}>Student ID</Text>
              <TextInput
                style={styles.studentInput}
                value={studentId}
                onChangeText={setStudentId}
                placeholder="STU-0000"
              />
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresar título"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ingresar descripción"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "Guardar cambios" : "Crear item"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  meta: {
    flexDirection: "column",
    gap: 2,
    maxWidth: "70%",
  },
  studentField: {
    maxWidth: 180,
  },
  studentLabel: {
    fontSize: 11,
    color: "#555",
    marginBottom: 4,
  },
  studentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    backgroundColor: "#fff",
    minWidth: 120,
  },
  createdAt: {
    fontSize: 11,
    color: "#666",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
