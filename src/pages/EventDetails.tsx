import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { uploadImage } from '../services/imageApi';
import { useRoute, RouteProp } from '@react-navigation/native';

type RouteParams = {
    params: {
        title: string;
        date: string;
    };
};

export default function EventDetails() {
    const imageUrl = 'https://i.ibb.co/s9Ys2VJ/andrea-mininni-VLlk-OJdz-LG0-unsplash.jpg';
    const route = useRoute<RouteProp<RouteParams, 'params'>>();
    const { title, date } = route.params;
    
    
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: imageUrl }} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{date}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 20,
        color: 'black',
    },
    image: {
        width: 400,
        height: 200,
        marginBottom: 20,
    }
});