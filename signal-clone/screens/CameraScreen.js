import React, { useLayoutEffect,useRef } from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera';
import { useState } from 'react';
import { useEffect } from 'react';
import { Ionicons,MaterialIcons,Entypo} from "@expo/vector-icons"
import CameraPreview from '../components/CameraPreview';
import { storage, auth } from './firebase';
import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
// import * as MediaLibrary from 'expo-media-library';


const CameraScreen = ({navigation}) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [firebaseUrl, setFirebaseUrl] = useState("");
    const cam = useRef();
    
    const takePicture = async () => {
        if (!cam) return
    const options = { quality: 0.7, base64: true };
    const photo = await cam.current.takePictureAsync(options)
    // console.log(photo)
        setPreviewVisible(true)
        setCapturedImage(photo)
   
    }

    const savePhoto = async() => {
        // console.log(capturedImage.uri)
        const response = await fetch(capturedImage.uri);

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
                };
                xhr.onerror = function(e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', capturedImage.uri, true);
                xhr.send(null);
        });

        const date = new Date()
        const uploadTask = storage.ref(`images/${auth.currentUser.uid}.jpeg`).put(blob)
        // console.log(auth.currentUser)
        
        uploadTask.on("state_changed",
            (snapshot) => { },
            (e)=>{alert(e)},
            () => {
            storage
                .ref("images")
                .child(`${auth.currentUser.uid}.jpeg`)
                .getDownloadURL()
                .then(url => {
                    // console.log("GET URL>>>>", url)
                    auth.currentUser.updateProfile({
                    photoURL: url || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png"
                    }).then(navigation.replace("Home"))
                }).catch(error => alert(error.message))
                
        })
        
        // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // if (status === "granted") {
        //     const asset = await MediaLibrary.createAssetAsync(capturedImage.uri);
        //     console.log(asset)
        //     // MediaLibrary.createAlbumAsync('Signal-clone',asset)
            
      
        // } else {
        //     console.log("Permission not Granted")
        // }
    }

    const retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        // setHasPermission(null)
    }
    
    
  
    const handleFlashMode = () => {
        console.log(flashMode)
        if (flashMode === Camera.Constants.FlashMode.on) {
        setFlashMode(Camera.Constants.FlashMode.off)
        } else if (flashMode === Camera.Constants.FlashMode.off) {
        setFlashMode(Camera.Constants.FlashMode.on)
        } else {
        setFlashMode(Camera.Constants.FlashMode.auto)
        }

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Update Profile Picture",
            headerBackTitle: "Home",
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 60,
                    marginRight: 20
                }}>
                    <TouchableOpacity activeOpacity={0.5} style={{backgroundColor: flashMode === 0 ? '#000' : '#fff'}} onPress={handleFlashMode}>
                            <Entypo style={{ color: 'white', fontWeight: 'bold' }} size={24} name="flash" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                            );
                        }}>
                        <Ionicons name="camera-reverse" style={{ color: 'white', fontWeight: 'bold' }} size={24}/>
                    </TouchableOpacity>
                    
                </View>
            ),
        })
    },[navigation,type,flashMode])

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);
    

    if (hasPermission === null) {
        return (
            <View/>
            // alert("Camera Not Found")
            // navigation.goBack();
        );
    }
    if (hasPermission === false) {
        return (
            
            <Text>
                "No access to camera"
            </Text>
            //     .then(() => {
            //     navigation.goBack()
            // })
            
        );
    }

    return (
        <View style={styles.container}>
            {previewVisible && capturedImage ? (
                <CameraPreview photo={capturedImage} savePhoto={savePhoto} retakePicture={retakePicture} />
            ) : (
                <Camera style={styles.camera} type={type} ref={cam} flashMode={flashMode}>
                    <View style={styles.clickView}>
                        <TouchableOpacity style={styles.clickView} onPress={takePicture}>
                            <MaterialIcons style={{ color: 'white' }} size={60} name="camera" />
                        </TouchableOpacity>
                    </View>
                </Camera>
            )
            }
        </View>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        borderRadius: 50,
        },
    clickView: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
      
    },
    clickView: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
        alignItems: 'center'
    }
 
})
