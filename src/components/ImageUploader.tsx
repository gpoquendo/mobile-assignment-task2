import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

interface ImageType {
  uri: string;
  fileName: string;
  fileSize: string;
}

interface ImageUploaderProps {
  style?: any;
  setImageUrl: (url: string) => void;
}

const ImageUploader = (props: ImageUploaderProps) => {
  const [image, setImage] = useState<{
    uri: string;
    fileName: string;
    fileSize: string;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSelectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "We need access to your photo library to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setImage({
          uri: selectedAsset.uri || "",
          fileName: "image_01.jpg", // Expo's picker does not provide file name
          fileSize: "245", // Expo's picker does not provide file size
        });
        props.setImageUrl(selectedAsset.uri || "");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while selecting the image. Please try again."
      );
      console.error(error);
    }
  };

  const handleCaptureImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "We need access to your camera to capture images."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setImage({
          uri: selectedAsset.uri || "",
          fileName: "image_01.jpg", // Expo's picker does not provide file name
          fileSize: "245", // Expo's picker does not provide file size
        });
        props.setImageUrl(selectedAsset.uri || "");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while capturing the image. Please try again."
      );
      console.error(error);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    props.setImageUrl("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Picture</Text>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.thumbnail} />
          <View style={styles.imageInfo}>
            <Text>{image.fileName}</Text>
            <Text>{image.fileSize} KB</Text>
          </View>
          <TouchableOpacity
            onPress={handleRemoveImage}
            style={styles.removeButton}
          >
            <Feather name="x" size={30} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadBox} onPress={handleCaptureImage}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#888",
  },
  uploadBox: {
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#7fc2f4",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f2f7",
  },
  plusText: {
    fontSize: 24,
    color: "#7fc2f4",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7fc2f4",
    padding: 10,
    borderRadius: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  imageInfo: {
    flex: 1,
  },
  removeButton: {
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ImageUploader;
