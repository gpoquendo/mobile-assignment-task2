/**
 * The `CreateEvent` component allows users to select a location on a map for creating an event.
 * It displays a map using `react-native-maps` and allows users to place a marker by tapping on the map.
 * Users can proceed to the next step by pressing the "Next" button after selecting a location.
 *
 * @param {StackScreenProps<any>} props - The navigation props passed to the component.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @component
 * @example
 * return (
 *   <CreateEvent />
 * )
 */
import React, { useEffect, useRef, useState } from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  MapPressEvent,
} from "react-native-maps";
import * as MapSettings from "../constants/MapSettings";
import { View, Text, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";
import { RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import BigButton from "../components/BigButton";
import mapMarkerImgPartial from "../images/map-marker.png";

export default function CreateEvent(props: StackScreenProps<any>) {
  const { navigation } = props;
  const mapViewRef = useRef<MapView>(null);

  const [markerLocation, setMarkerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    console.log("Map pressed!", event.nativeEvent);
    const { coordinate } = event.nativeEvent;
    setMarkerLocation(coordinate);
  };

  const handleNext = () => {
    if (markerLocation) {
      navigation.navigate("EventForm", { location: markerLocation });
    } else {
      alert("Please select a location for the event.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RectButton
          style={styles.backButton}
          onPress={() => navigation.navigate("EventsMap")}
        >
          <Feather
            style={styles.backIcon}
            name="arrow-left"
            size={25}
            color="#007AFF"
          />
        </RectButton>
        <Text style={styles.headText}>Add event</Text>
        <RectButton
          style={styles.closeButton}
          onPress={() => navigation.navigate("EventsMap")}
        >
          <Feather
            style={styles.closeIcon}
            name="x"
            size={25}
            color="#ff0000"
          />
        </RectButton>
      </View>

      <MapView
        ref={mapViewRef}
        mapPadding={MapSettings.EDGE_PADDING}
        initialRegion={{
          latitude: 51.04758,
          longitude: -114.06779,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        style={styles.mapStyle}
        onPress={handleMapPress}
      >
        {markerLocation && (
          <Marker
            coordinate={markerLocation}
            title="Event Location"
            description="This is the selected location"
            onPress={(e) => {
              e.stopPropagation();
              console.log("Marker pressed!", e.nativeEvent);
            }}
          >
            <Image
              resizeMode="contain"
              style={{ width: 48, height: 54 }}
              source={mapMarkerImgPartial}
            />
          </Marker>
        )}
      </MapView>

      {markerLocation && (
        <BigButton
          label="Next"
          onPress={handleNext}
          color={"#00A3FF"}
          style={styles.bigButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 60,
  },

  mapStyle: {
    flex: 1,
    width: "100%",
    height: "80%",
    justifyContent: "flex-end",
  },

  header: {
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
  },

  headText: {
    fontSize: 20,
    color: "#999999",
    fontWeight: "bold",
    textAlign: "center",
  },

  backButton: {
    padding: 10,
  },

  backIcon: {
    left: 10,
  },

  closeButton: {
    padding: 10,
  },

  closeIcon: {
    right: 10,
  },

  bigButton: {
    position: "absolute",
    bottom: 40,
    width: "90%",
    alignSelf: "center",
  },
});
