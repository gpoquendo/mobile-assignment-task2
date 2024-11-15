import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface LabeledInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
}

/**
 * A labeled input component that displays a label and a text input field.
 *
 * @param {Object} LabeledInputProps - The properties object.
 * @param {string} LabeledInputProps.label - The label text to display above the input field.
 * @param {string} LabeledInputProps.value - The current value of the input field.
 * @param {function} LabeledInputProps.onChangeText - Callback function to handle text changes in the input field.
 * @param {boolean} [LabeledInputProps.multiline] - Whether the input field should support multiple lines of text.
 * @param {number} [LabeledInputProps.numberOfLines] - The number of lines to display in the input field when multiline is true.
 * @param {Object} [LabeledInputProps.style] - Additional styles to apply to the container view.
 *
 * @returns {JSX.Element} The rendered labeled input component.
 */
const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline ? styles.textArea : null]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#999999',
  },
  input: {
    height: 50,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default LabeledInput;