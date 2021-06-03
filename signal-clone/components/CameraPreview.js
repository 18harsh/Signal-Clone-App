import React from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'

const CameraPreview = ({ photo,savePhoto,retakePicture }) => {
    // console.log('PHOTO>>>>>', photo)
    return (
         <View
            style={{
                backgroundColor: 'transparent',
                flex: 1,
                width: '100%',
                height: '100%'
            }}
            >
            <ImageBackground
                source={{uri: photo && photo.uri}}
                style={{
                flex: 1
                }}
            >
                 <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        padding: 15,
                        justifyContent: 'flex-end'
                    }}
                    >
                    <View
                        style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                        onPress={retakePicture}
                        style={{
                            width: 130,
                            height: 40,
                            marginBottom: 20,
                            alignItems: 'center',
                            borderRadius: 4
                        }}
                        >
                        <MaterialIcons style={{ color: '#fff' }} size ={50} name="cancel"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={savePhoto}
                        style={{
                            width: 130,
                            height: 40,
                            alignItems: 'center',
                            borderRadius: 4,
                            marginBottom: 20
                        }}
                        >
                            <MaterialIcons style={{color: '#fff'}} size ={50} name="done"/>
                        </TouchableOpacity>
                    </View>
                    </View>
            </ImageBackground>
            </View>
    )
}

export default CameraPreview

const styles = StyleSheet.create({})
