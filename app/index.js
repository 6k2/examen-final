import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ItemRow } from "../components/ItemRow";
import { useItems } from "../hooks/useItems";
import { deleteItem } from "../services/itemsService";

export default function HomeScreen() {
  const router = useRouter();
  const { items, loading, error } = useItems();

  const handleCreate = () => {
    router.push("/form");
  };

  const handleEdit = (item) => {
    router.push({
      pathname: "/form",
      params: {
        id: item.id,
        title: item.title,
        description: item.description || "",
      },
    });
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Eliminar item",
      `¿Seguro que quieres eliminar "${item.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteItem(item.id);
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "No se pudo eliminar el item.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Cargando items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Error al cargar items: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay items todavía. Crea el primero.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemRow
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}

      <Pressable style={styles.fab} onPress={handleCreate}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1976d2",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: {
    color: "#fff",
    fontSize: 30,
    marginTop: -2,
  },
});