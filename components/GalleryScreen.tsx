import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";

interface VideoItem {
  id: string;
  uri: string;
  name: string;
  date: string;
}

export default function GalleryScreen() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadVideos = async () => {
    try {
      const documentDir = FileSystem.documentDirectory;
      if (!documentDir) return;

      const files = await FileSystem.readDirectoryAsync(documentDir);
      const videoFiles = files.filter((file) => file.endsWith(".mp4"));

      const videoItems: VideoItem[] = videoFiles.map((file) => {
        const uri = `${documentDir}${file}`;
        const date = new Date().toLocaleDateString(); // You could extract date from filename
        return {
          id: file,
          uri,
          name: file,
          date,
        };
      });

      setVideos(videoItems);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const deleteVideo = async (video: VideoItem) => {
    Alert.alert(
      "Delete Video",
      `Are you sure you want to delete "${video.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(video.uri);
              await loadVideos(); // Refresh the list
            } catch (error) {
              console.error("Error deleting video:", error);
              Alert.alert("Error", "Failed to delete video");
            }
          },
        },
      ]
    );
  };

  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <View style={styles.videoItem}>
      <View style={styles.videoInfo}>
        <Text style={styles.videoName}>{item.name}</Text>
        <Text style={styles.videoDate}>{item.date}</Text>
        <Text style={styles.videoPath}>{item.uri}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteVideo(item)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No videos recorded yet</Text>
        <Text style={styles.emptySubtext}>Record a video to see it here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
  listContainer: {
    padding: 16,
  },
  videoItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoInfo: {
    flex: 1,
  },
  videoName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  videoDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  videoPath: {
    fontSize: 12,
    color: "#999",
    fontFamily: "monospace",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
