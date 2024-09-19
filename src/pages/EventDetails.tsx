import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";

type RouteParams = {
  params: {
    title: string;
    date: string;
    vCount: number;
    vRequired: number;
    isApplied: boolean;
    isFull: boolean;
  };
};

export default function EventDetails(props: StackScreenProps<any>) {
  const { navigation } = props;
  const imageUrl =
    "https://i.ibb.co/SRXqzwr/joel-muniz-BEr-JJL-Ksj-A-unsplash.jpg";
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { title, date, vCount, vRequired, isApplied, isFull } = route.params;

  const statusBox = () => {
    if (isApplied) {
      return <Text style={styles.text}>Volunteered</Text>;
    } else if (isFull) {
      return <Text style={styles.text}>Team is full.</Text>;
    } else {
      return (
        <Text style={styles.text}>{`${vCount}/${vRequired} volunteers`}</Text>
      );
    }
  };

  const buttons = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("EventsMap")}
        >
          <Text style={styles.backButtonText}>{"←"}</Text>
        </TouchableOpacity>
        {(isApplied || !isFull) && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("Share")}
          >
            <Ionicons name="share-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        )}
        {isApplied && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log("Call")}
            >
              <Ionicons name="call-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log("Text")}
            >
              <Ionicons name="chatbubble-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Text</Text>
            </TouchableOpacity>
          </>
        )}
        {!isApplied && !isFull && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("Volunteer")}
          >
            <Ionicons name="hand-left-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Volunteer</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{date}</Text>
      {statusBox()}
      {buttons()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
    color: "black",
  },
  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 30,
    color: "#007AFF",
  },
});
