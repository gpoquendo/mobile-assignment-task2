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

/**
 * ImageUploader component allows users to upload or capture an image.
 * It provides functionalities to request permissions, select an image from the media library,
 * capture an image using the camera, and remove the selected image.
 *
 * @component
 * @param {ImageUploaderProps} props - The props for the ImageUploader component.
 * @param {function} props.setImageUrl - Function to update the parent component with the selected image's URI.
 *
 * @typedef {Object} ImageUploaderProps
 * @property {function} setImageUrl - Function to update the parent component with the selected image's URI.
 *
 * @returns {JSX.Element} The rendered ImageUploader component.
 */
const ImageUploader = (props: ImageUploaderProps) => {
  const [image, setImage] = useState<{
    uri: string;
    fileName: string;
    fileSize: string;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  /**
   * Handles the image selection process from the media library.
   * Requests permission to access the media library, and if granted,
   * allows the user to select an image. If an image is selected,
   * it updates the state with the image's URI, a default file name,
   * and a default file size. It also updates the parent component
   * with the selected image's URI.
   *
   * @async
   * @function handleSelectImage
   * @throws Will alert the user if permission is denied or if an error occurs during image selection.
   */
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

  /**
   * Handles the image capture process using the device's camera.
   * 
   * This function requests camera permissions, launches the camera for image capture,
   * and processes the captured image. If the user denies camera permissions, an alert
   * is shown. If an image is successfully captured, it updates the state with the image
   * URI, a default file name, and a default file size. It also updates the parent component
   * with the image URI.
   * 
   * @async
   * @function handleCaptureImage
   * @returns {Promise<void>} A promise that resolves when the image capture process is complete.
   * @throws Will show an alert and log an error if an error occurs during the image capture process.
   */
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
