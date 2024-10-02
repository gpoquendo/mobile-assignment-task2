import React, { useContext, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import BigButton from "../components/BigButton";
import { RectButton } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import mapMarkerImg from "../images/map-marker.png";
import { AuthenticationContext } from "../context/AuthenticationContext";

type RouteParams = {
  params: {
    event: any;
    user: any;
  };
};

type RootStackParamList = {
  EventsMap: undefined;
  EventDetails: RouteParams["params"];
};

type EventDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EventDetails"
>;

export default function EventDetails() {
  const navigation = useNavigation<EventDetailsNavigationProp>();
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const {
    event, user
  } = route.params;
  const imageUrl = event.imageUrl;
  const mapViewRef = useRef<MapView>(null);
  const authenticationContext = useContext(AuthenticationContext);
  const date = new Date(event.dateTime);

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const statusIcon = () => {
    const volunteersIds = event.volunteersIds || [];
    const volunteersNeeded = event.volunteersNeeded || 0;

    if (volunteersIds.includes(authenticationContext?.value?.id)) {
      return <Feather name="check" size={50} color="#007AFF" />;
    } else if (volunteersNeeded == volunteersIds.length) {
      return <Feather name="slash" size={70} color="grey" />;
    } else {
      return (
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#cc8500",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {volunteersNeeded - volunteersIds.length} <Text style={{ fontSize: 20 }}>of</Text>{" "}
          {volunteersNeeded}
        </Text>
      );
    }
  };

  const statusText = () => {
    const volunteerIds = event.volunteersIds || [];
    const volunteersNeeded = event.volunteersNeeded || 0;

    if (volunteerIds.includes(authenticationContext?.value?.id)) {
      return <Text>Volunteered</Text>;
    } else if (volunteersNeeded == volunteerIds.length) {
      return <Text>Team is full</Text>;
    } else {
      return <Text>Volunteer(s) needed</Text>;
    }
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headText}>Event</Text>
      </RectButton>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.organizer}>organized by Robert Last</Text>
        <Text style={styles.description}>
          {event.description}
        </Text>
        <View style={styles.cardContainer}>
          <View style={styles.dateTimeContainer}>
            <Feather name="calendar" size={50} color="#007AFF" />
            <Text style={styles.dateTimeText}>{formattedDate}</Text>
            <Text style={styles.dateTimeText}>{formattedTime}</Text>
          </View>
          
          {/* User has applied to volunteer */}
          {event.volunteersIds?.includes(authenticationContext?.value?.id) && (
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: "#e5e3fa", borderColor: "#007AFF" },
              ]}
            >
              {statusIcon()}
              <Text style={[styles.statusText, { color: "#007AFF" }]}>
                {statusText()}
              </Text>
            </View>
          )}

          {/* Event is full */}
          {event.volunteersNeeded == event.volunteersIds?.length && !event.volunteersIds?.includes(authenticationContext?.value?.id) && (
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: "#d9d9d9", borderColor: "grey" },
              ]}
            >
              {statusIcon()}
              <Text style={[styles.statusText, { color: "grey" }]}>
                {statusText()}
              </Text>
            </View>
          )}

          {/* User has not applied to volunteer and there are still spots available */}
          {!event.volunteersIds?.includes(authenticationContext?.value?.id) && event.volunteersNeeded > event.volunteersIds?.length && (
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: "#ffdb99", borderColor: "#cc8500" },
              ]}
            >
              {statusIcon()}
              <Text style={[styles.statusText, { color: "#cc8500" }]}>
                {statusText()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {event.volunteersIds?.includes(authenticationContext?.value?.id) && (
            <>
              <BigButton
                label="Share"
                onPress={() => {}}
                featherIconName="share-2"
                color="#007AFF"
                style={styles.button}
              />
              <BigButton
                label="Call"
                onPress={() => {}}
                featherIconName="phone"
                color="#007AFF"
                style={styles.button}
              />
              <BigButton
                label="Text"
                onPress={() => {}}
                featherIconName="message-circle"
                color="#007AFF"
                style={styles.button}
              />
            </>
          )}
          {!event.volunteersIds?.includes(authenticationContext?.value?.id) && event.volunteersNeeded > event.volunteersIds?.length && (
            <>
              <BigButton
                label="Share"
                onPress={() => {}}
                featherIconName="share-2"
                color="#007AFF"
                style={styles.button}
              />
              <BigButton
                label="Volunteer"
                onPress={() => {}}
                featherIconName="plus"
                color="#cc8500"
                style={styles.button}
              />
            </>
          )}
        </View>
        <View style={styles.separator} />
        <View style={styles.mapContainer}>
          <MapView
            ref={mapViewRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: event.position.latitude,
              longitude: event.position.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            style={styles.mapStyle}
            showsMyLocationButton={false}
            showsUserLocation={true}
            rotateEnabled={false}
            toolbarEnabled={false}
            moveOnMarkerPress={false}
          >
            <Marker
              coordinate={{
                latitude: event.position.latitude,
                longitude: event.position.longitude,
              }}
              >
                <Image
                resizeMode="contain"
                style={{ width: 48, height: 54 }}
                source={mapMarkerImg}
              />
              </Marker>
          </MapView>
        </View>
        <BigButton
        label="Get Directions to Event"
        style={{ width: "90%", position: "relative", bottom: 40 }}
        onPress={() => {}}
        featherIconName="map-pin"
        color="#4d4d4d"
      />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },

  headText: {
    fontSize: 20,
    color: "grey",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },

  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "100%",
    height: 60,
    position: "relative",
  },

  backIcon: {
    position: "absolute",
    left: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "grey",
    alignSelf: "flex-start",
    marginLeft: 20,
  },

  organizer: {
    fontSize: 13,
    color: "grey",
    alignSelf: "flex-start",
    marginLeft: 20,
  },

  description: {
    fontSize: 16,
    color: "grey",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 10,
  },

  cardContainer: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    height: 200,
  },

  dateTimeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e3fa",
    borderWidth: 1.5,
    borderColor: "#007AFF",
    borderRadius: 10,
    marginRight: 10,
  },

  dateTimeText: {
    fontSize: 16,
    marginTop: 5,
    color: "#007AFF",
  },

  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 16,
    textAlign: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },

  button: {
    margin: 5,
  },

  separator: {
    height: 1.5,
    width: "90%",
    backgroundColor: "#CED0CE",
    margin: 10,
  },

  mapContainer: {
    borderWidth: 1,
    borderColor: "#CED0CE",
    height: 300,
    width: "90%",
    marginVertical: 10,
    borderRadius: 10,
    marginBottom: 50,
    overflow: "hidden",
  },
  
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },

  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
    color: 'gray',
  },
});
