/**
 * EventForm component allows users to create a new event by filling out a form.
 * It includes fields for event name, description, number of volunteers needed, date and time, and an image uploader.
 * The form validates the input fields and enables the save button only when all fields are correctly filled.
 * On saving, it navigates to the EventsMap screen with the newly created event details.
 *
 * @param {Object} props - The component props.
 * @param {EventFormRouteProp} props.route - The route prop containing the location parameter.
 * @returns {JSX.Element} The rendered EventForm component.
 */
import React, { useEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import BigButton from "../components/BigButton";
import { RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import LabeledInput from "../components/LabeledInput";
import ImageUploader from "../components/ImageUploader";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';
import moment from "moment";
import { RouteProp } from "@react-navigation/native";

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

type RootStackParamList = {
  EventForm: { location: { latitude: number; longitude: number } };
  EventsMap: { newEvent?: event};
  CreateEvent: undefined;
};

type EventFormRouteProp = RouteProp<RootStackParamList, 'EventForm'>;

export default function EventForm({ route }: { route: EventFormRouteProp }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { location } = route.params;
  const [eventName, setEventName] = useState("");
  const [about, setAbout] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [eventName, about, volunteersNeeded, dateTime, location, imageUrl]);

  /**
   * Validates the event form by checking if all required fields are filled and valid.
   * 
   * The form is considered valid if:
   * - `eventName` is not empty or just whitespace.
   * - `about` is not empty or just whitespace.
   * - `volunteersNeeded` is not empty or just whitespace.
   * - `dateTime` is not empty or just whitespace.
   * - `location.latitude` is not zero.
   * - `location.longitude` is not zero.
   * - `imageUrl` is not empty or just whitespace.
   * 
   * If all conditions are met, sets `isFormValid` to true, otherwise sets it to false.
   */
  const validateForm = () => {
    if (
      eventName.trim() &&
      about.trim() &&
      volunteersNeeded.trim() &&
      dateTime.trim() &&
      location.latitude !== 0 &&
      location.longitude !== 0 &&
      imageUrl.trim()
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };
  
  /**
   * Handles the save action for the event form.
   * Parses the date and time, creates a new event object, and navigates to the EventsMap screen with the new event.
   *
   * @returns {void}
   */
  const handleSave = () => {
    const parsedDateTime = moment(dateTime, "MMMM DD, YYYY hh:mm A").toISOString();
    const newEvent = {
      id: uuidv4(),
      name: eventName,
      description: about,
      volunteersNeeded: parseInt(volunteersNeeded),
      dateTime: parsedDateTime,
      position: location,
      imageUrl: imageUrl,
      organizerId: "EF-BZ00",
      volunteersIds: []
    };
    navigation.navigate("EventsMap", { newEvent });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RectButton
          style={styles.backButton}
          onPress={() => navigation.navigate("CreateEvent")}
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
          onPress={() => navigation.navigate({ name: "EventsMap", params: {} })}
        >
          <Feather
            style={styles.closeIcon}
            name="x"
            size={25}
            color="#ff0000"
          />
        </RectButton>
      </View>

      <View style={styles.formContainer}>
        <LabeledInput
          style={styles.input}
          label="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />
        <LabeledInput
          style={styles.textarea}
          multiline={true}
          numberOfLines={4}
          label="About"
          value={about}
          onChangeText={setAbout}
        />
        <LabeledInput
          style={styles.input}
          label="Volunteers Needed"
          value={volunteersNeeded}
          onChangeText={setVolunteersNeeded}
        />
        <LabeledInput
          style={styles.input}
          label="Date and Time"
          value={dateTime}
          onChangeText={setDateTime}
        />
        <ImageUploader style={styles.imageUploader} setImageUrl={setImageUrl} />
      </View>

      <BigButton
        label="Save"
        onPress={handleSave}
        color={"#00A3FF"}
        style={styles.bigButton}
        disabled={!isFormValid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: "15%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingTop: 50,
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

  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
  },

  input: {
    width: "90%",
    alignSelf: "center",
  },

  textarea: {
    width: "90%",
    alignSelf: "center",
  },

  imageUploader: {
    marginBottom: 10,
  },

  bigButton: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 40,
  },
});
