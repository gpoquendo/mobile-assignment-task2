import Constants from 'expo-constants';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Platform } from 'react-native';
import { LatLng } from 'react-native-maps';

/**
 * Converts a number of bytes into a human-readable string with the appropriate unit.
 *
 * @param bytes - The number of bytes to format.
 * @param decimals - The number of decimal places to include in the formatted string. Defaults to 2.
 * @returns A string representing the formatted number of bytes with the appropriate unit.
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Formats a given date object into a 12-hour time string with AM/PM.
 *
 * @param date - The date object to format.
 * @returns A string representing the formatted time in 12-hour format with AM/PM.
 */
export const formatAMPM = (date: Date): string => {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const newHours = hours % 12 ? hours : 12; // the hour '0' should be '12'
    const newMinutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = newHours + ':' + newMinutes + ' ' + ampm;
    return strTime;
};

/**
 * Adds a specified number of hours to a given Date object.
 *
 * @param dateTime - The initial Date object to which hours will be added.
 * @param hoursToAdd - The number of hours to add to the dateTime.
 * @returns A new Date object with the specified number of hours added.
 */
export const addHours = (dateTime: Date, hoursToAdd: number) => {
    const milisecondsToAdd = hoursToAdd * 60 * 60 * 1000;
    const newDate = new Date(dateTime);
    return new Date(newDate.setTime(newDate.getTime() + milisecondsToAdd));
};

/**
 * Updates the time of an existing date with the time from a new date.
 *
 * @param existingDate - The original date whose time will be updated.
 * @param newTime - The new date from which the time will be taken.
 * @returns A new Date object with the updated time.
 */
export const updateDateWithNewTime = (existingDate: Date, newTime: Date): Date => {
    const newDate = new Date(new Date(existingDate).setHours(newTime.getHours(), newTime.getMinutes(), 0, 0));
    return newDate;
};

/**
 * Sanitizes an email address by trimming whitespace and converting it to lowercase.
 *
 * @param email - The email address to sanitize.
 * @returns The sanitized email address.
 */
export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

/**
 * Validates an email address.
 *
 * This function checks if the provided email address is valid by matching it against a regular expression pattern.
 * It first trims any leading or trailing whitespace and converts the email to lowercase before performing the validation.
 *
 * @param email - The email address to validate.
 * @returns `true` if the email address is valid, `false` otherwise.
 */
export const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    const sanitizedEmail = email.trim().toLowerCase();
    const result = sanitizedEmail.match(regex);
    return !!result?.[0];
};

/**
 * Parses a date field from each object in an array of JSON responses.
 *
 * @param array - The array of objects to be processed.
 * @param fieldName - The name of the field to be parsed as a date.
 * @returns A new array with the specified field parsed as a Date object.
 */
export const parseDateFieldFromJSONResponse = (array: [], fieldName: string): any[] => {
    return array.map((x: any) => {
        x[fieldName] = new Date(x[fieldName]);
        return x;
    });
};

/**
 * Converts a given string to a number.
 *
 * @param text - The string to be converted to a number.
 * @returns The numeric representation of the input string.
 */
export const castToNumber = (text: string) => {
    return Number(text);
};

/**
 * Retrieves the value of the specified environment variable from the Expo configuration.
 *
 * @param variableName - The name of the environment variable to retrieve.
 * @returns The value of the environment variable if it exists.
 * @throws An error if the environment variable is not found.
 */
export const getEnvironentVariable = (variableName: string) => {
    try {
        const value = Constants.expoConfig?.extra?.[variableName];
        if (value != null) {
            return value;
        } else {
            throw new Error(`${variableName} not found.`);
        }
    } catch (e) {
        console.warn(e);
    }
};

/**
 * Generates a URL to open a map application with the given coordinates.
 *
 * @param coordinates - An object containing latitude and longitude.
 * @returns A string representing the URL to open the map application.
 */
export const getMapsUrl = (coordinates: LatLng): string => {
    const { latitude, longitude } = coordinates;
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Label';
    return Platform.OS === 'ios' ? `maps:0,0?q=${label}@${latLng}` : `geo:0,0?q=${latLng}(${label})`;
};

/**
 * Checks if a given JWT token is expired.
 *
 * @param token - The JWT token to check.
 * @returns `true` if the token is expired, `false` otherwise.
 */
export const isTokenExpired = (token: string) => {
    const decodedToken = jwtDecode(token) as JwtPayload;
    const currentDate = Date.now();
    if ((decodedToken.exp as number) * 1000 < currentDate) {
        return true;
    } else {
        return false;
    }
};
