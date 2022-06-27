import React, {useEffect, useState} from 'react';
import { Alert, FlatList } from 'react-native';
import storage from '@react-native-firebase/storage'

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File } from '../../components/File';

import { photosData } from '../../utils/photo.data';

export function Receipts() {
  const [photos, setPhotos] = useState([])
  const [fileSelected, setFileSelected] = useState('')

  useEffect(()=>{
    storage().ref('images').list().then((r)=>{
      const files = []
      r.items.forEach((file)=>{
        files.push({
          name: file.name,
          path: file.fullPath,
        })
      })

      setPhotos(files)
    })
  },[])

   const handleShowFile = async (path) =>{
    const urlFile = await storage().ref(path).getDownloadURL();
    setFileSelected(urlFile)
  }

  const handleDeleteFile = async (path) =>{
    storage().ref(path).delete().then(()=>{
      Alert.alert('Arquivo apagado com sucesso!')
    }).catch(err=>{
      Alert.alert(err)
    })
  }


  return (
    <Container>
      <Header title="Comprovantes" />

      <Photo uri={fileSelected}/>

      <PhotoInfo>
        Informações da foto
      </PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowFile(item.path)}
            onDelete={() => handleDeleteFile(item.path)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
