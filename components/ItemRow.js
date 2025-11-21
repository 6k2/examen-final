import { Pressable, StyleSheet, Text, View } from "react-native";

export function ItemRow({ item, onEdit, onDelete }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={[styles.button, styles.editButton]}>
          <Text style={styles.buttonText}>Editar</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Borrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: "#4caf50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
});