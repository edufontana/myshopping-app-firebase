import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';
import { Alert } from 'react-native';

export function Upload() {
  const [image, setImage] = useState('');

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  async function handleFileUpload() {
    const fileName = new Date().getTime();
    const ref = storage().ref(`/images/${fileName}.png`);

    ref.putFile(image).then((r)=>{
      Alert.alert('deu certo')
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <Container>
      <Header title="Lista de compras" />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button
          title="Fazer upload"
          onPress={handleFileUpload}
        />

        <Progress>
          0%
        </Progress>

        <Transferred>
          0 de 100 bytes transferido
        </Transferred>
      </Content>
    </Container>
  );
}
