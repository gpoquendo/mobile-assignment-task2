import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import customMapStyle from "../../map-style.json";
import * as MapSettings from "../constants/MapSettings";
import { AuthenticationContext } from "../context/AuthenticationContext";
import mapMarkerImgPartial from "../images/map-marker.png";
import mapMarkerImgFull from "../images/map-marker-grey.png";
import mapMarkerImgApplied from "../images/map-marker-blue.png";
import { useRoute, RouteProp } from "@react-navigation/native";

type EventsMapRouteProp = RouteProp<{ params: RouteParams }, "params">;

export default function EventsMap(props: StackScreenProps<any>) {
  const { navigation } = props;
  const authenticationContext = useContext(AuthenticationContext);
  const mapViewRef = useRef<MapView>(null);
  const [event, setEvent] = useState<event[]>(events);
 
  const route = useRoute<EventsMapRouteProp>();

  const userId = authenticationContext?.value?.id || "";
  if (userId) {
    console.log(`Logged in user ID: ${userId}`);
  } else {
    console.log("No user is logged in.");
  }

  const handleNavigateToCreateEvent = () => {
    navigation.navigate("CreateEvent");
  };

  const handleNavigateToEventDetails = (event: any) => {
    navigation.navigate("EventDetails", {event});
  };

  const handleLogout = async () => {
    AsyncStorage.multiRemove(["userInfo", "accessToken"]).then(() => {
      authenticationContext?.setValue(undefined);
      navigation.navigate("Login");
    });
  };

  useEffect(() => {
    if (route.params?.newEvent) {
      setEvent(prevEvents => [...prevEvents, route.params.newEvent].filter(event => event !== undefined));
    }
  }, [route.params?.newEvent]);

  const getMarkerImage = (volunteersNeeded: number, volunteerIds: string[] = [], userId: string) => {
    if (volunteerIds.includes(userId)) {
      return mapMarkerImgApplied;
    } else if (volunteerIds.length >= volunteersNeeded) {
      return mapMarkerImgFull;
    } else {
      return mapMarkerImgPartial;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={MapSettings.DEFAULT_REGION}
        style={styles.mapStyle}
        customMapStyle={customMapStyle}
        showsMyLocationButton={false}
        showsUserLocation={true}
        rotateEnabled={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        mapPadding={MapSettings.EDGE_PADDING}
        onLayout={() =>
          mapViewRef.current?.fitToCoordinates(
            events.map(({ position }) => ({
              latitude: position.latitude,
              longitude: position.longitude,
            })),
            { edgePadding: MapSettings.EDGE_PADDING }
          )
        }
      >
        {event.map((event) => {
          return (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.position.latitude,
                longitude: event.position.longitude,
              }}
              onPress={() =>
                handleNavigateToEventDetails(event)}
            >
              <Image
                resizeMode="contain"
                style={{ width: 48, height: 54 }}
                source={getMarkerImage(event.volunteersNeeded, event.volunteersIds, userId)}
              />
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{event.length} event(s) found</Text>
        <RectButton
          style={[styles.smallButton, { backgroundColor: "#00A3FF" }]}
          onPress={handleNavigateToCreateEvent}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
      <RectButton
        style={[
          styles.logoutButton,
          styles.smallButton,
          { backgroundColor: "#4D6F80" },
        ]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#FFF" />
      </RectButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },

  logoutButton: {
    position: "absolute",
    top: 70,
    right: 24,

    elevation: 3,
  },

  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 40,

    backgroundColor: "#FFF",
    borderRadius: 16,
    height: 56,
    paddingLeft: 24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
  },

  footerText: {
    fontFamily: "Nunito_700Bold",
    color: "#8fa7b3",
  },

  smallButton: {
    width: 56,
    height: 56,
    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },
});

interface event {
  id: string;
  position: {
    latitude: number;
    longitude: number;
  };
  name: string;
  dateTime: string;
  description: string;
  imageUrl?: string;
  organizerId: string;
  volunteersIds: string[];
  volunteersNeeded: number;
}

interface RouteParams {
  newEvent?: event;
}

const events: event[] = [
  {
      "id": "e3c95682-870f-4080-a0d7-ae8e23e2534f",
      "dateTime": "2022-01-11T21:30:00.000Z",
      "description": "Past events should not be displayed in the map",
      "name": "!!!Past Event!!!",
      "organizerId": "gpFfX6e",
      "position": {
          "latitude": 51.105761,
          "longitude": -114.106943
      },
      "volunteersNeeded": 1,
      "volunteersIds": []
  },
  {
      "id": "98301b22-2b76-44f1-a8da-8c86c56b0367",
      "dateTime": "2023-01-11T23:30:00.000Z",
      "description": "The Memorial Park Library is looking for volunteers to help setting up the stage for our talented local artists.\n\nAny previous event producing experience is greatly appreciated.",
      "imageUrl": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=max&w=1080&q=80",
      "name": "Downtown Vibe Live Music",
      "organizerId": "EF-BZ00",
      "position": {
          "latitude": 51.04112,
          "longitude": -114.069325
      },
      "volunteersNeeded": 4,
      "volunteersIds": ["3UN3-2L", "gpFfX6e", "tRHltUh", "ajY8pM2"]
  },
  {
      "id": "d7b8ea73-ba2c-4fc3-9348-9814076124bd",
      "dateTime": "2023-02-04T16:30:00.000Z",
      "description": "At the Flames Community Arena, we are offering a free skating lessons day with volunteer instructors.\n\nWe expect volunteer intructors to:\n- be reliable and enthusiastic\n- take initiative and be innovative\n- commit to a minimum of 4 hours of volunteering.",
      "imageUrl": "https://images.unsplash.com/photo-1528828465856-0ac27ee2aeb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=max&w=1080&q=80",
      "name": "Free Skating Lessons Day",
      "organizerId": "3UN3-2L",
      "position": {
          "latitude": 51.01222958257112,
          "longitude": -114.11677222698927
      },
      "volunteersNeeded": 10,
      "volunteersIds": ["EF-BZ00", "gpFfX6e", "Hr-40KW", "elKKrm3"]
  },
  {
      "id": "d1a6b9ea-877d-4711-b8d7-af8f1bce4d29",
      "dateTime": "2023-01-06T15:30:00.000Z",
      "description": "The Elboya School is looking for volunteers to teach computer programming to kids from grade 5 to 7.\n\nREQUIREMENTS:\n* Previous programming experience.\n* 4 hour commitment, from 8:30 AM to 12:30 AM.",
      "imageUrl": "https://images.unsplash.com/photo-1584697964328-b1e7f63dca95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=max&w=1080&q=80",
      "name": "Kids Programming Day",
      "organizerId": "Hr-40KW",
      "position": {
          "latitude": 51.010801915407036,
          "longitude": -114.07823592424393
      },
      "volunteersNeeded": 2,
      "volunteersIds": ["EF-BZ00", "Q5bVHgP"]
  }
];
