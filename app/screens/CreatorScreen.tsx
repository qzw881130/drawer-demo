import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Container,
  FormControl,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ScrollView,
  Spinner,
  Text,
  useToast,
  VStack,
} from "native-base";
import { NavigationProp } from "@react-navigation/native";
import { memes } from "@/assets/list";
import MemeSelector from "@/components/MemeSelector";
import { Meme, useApi } from "@/hooks/useApi";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

import { imageDemo } from "@/assets/imageDemo";

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouterProps<{ params: { meme: string } }, "params">;
}

const base64ToFileUri = async (base64String: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + "base64-image.jpg";
    const base64Data = base64String.split(",")[1];
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  } catch (err) {
    console.log("base64 to uri", err);
  }
};

export default CreatorScreen = ({ route }: RouterProps) => {
  const toast = useToast();
  const { createMeme } = useApi();
  const [selected, setSelected] = useState<any>();
  const [selectedName, setSelectedName] = useState<string>();

  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [blob, setBlob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    const { meme } = route.params || { meme: "10-Guy" };
    setSelected(memes[meme].image);
    setSelectedName(meme);
    console.log("meme name==", meme);
  }, [route]);

  const memeSelected = (meme: Meme) => {
    setSelected(meme.image);
    setSelectedName(meme.name);
  };

  const doCreateMeme = async () => {
    setLoading(true);
    const memeBlob = await createMeme(top, bottom, selectedName!);

    setBlob(memeBlob);
    // setResult(memeBlob);
    // setShowModal(true);
    // setLoading(false);
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(memeBlob.data);
    fileReaderInstance.onload = () => {
      console.log("ONLOAD");

      const base64data = fileReaderInstance.result;
      setResult(base64data);
      setShowModal(true);
      setLoading(false);
    };
  };

  const startDownload = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限不足", "您需要授予存储权限");
      return;
    }

    try {
      const fileUri = await base64ToFileUri(result);
      console.log("fileUri===", fileUri);
      console.log(result);
      const fileExists = await FileSystem.getInfoAsync(fileUri!);
      console.log(fileExists);
      // const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      // console.log(fileContent);
      // 创建图片资产
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      Alert.alert("成功", "图片已保存到相册");
    } catch (error) {
      console.log("error", error);
      Alert.alert("错误", "无法保存图片");
    }

    setShowModal(false);
    toast.show({ description: "Meme saved" });
  };

  return (
    <ScrollView>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={"lg"}>
        <Modal.Content maxWidth={400}>
          {/* <Modal.CloseButton /> */}
          <Modal.Header>Your Meme</Modal.Header>

          <Modal.Body>
            <Image
              source={{ uri: result }}
              alt="Result"
              resizeMode="contain"
              width={"400"}
              height={"200"}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button flex={1} onPress={() => startDownload()}>
              Download
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {loading && (
        <HStack m={10} space={2} justifyContent="center">
          <Spinner accessibilityLabel="Loading meme" color={"secondary.500"} />
          <Heading color="secondary.500" fontSize="md">
            Creating meme...
          </Heading>
        </HStack>
      )}
      {!loading && (
        <HStack m={4} space={2} mb={10}>
          <VStack w={"60%"} space={2}>
            <FormControl>
              <Input
                placeholder="Top Text"
                onChangeText={(text) => setTop(text)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Bottom Text"
                onChangeText={(text) => setBottom(text)}
              />
            </FormControl>
            <Button
              colorScheme={"secondary"}
              onPress={doCreateMeme}
              size={"md"}
            >
              Create Meme
            </Button>
          </VStack>
          <Center>
            <Image key={selected} source={selected} alt="Selected Meme"></Image>
          </Center>
        </HStack>
      )}
      <MemeSelector
        onSelect={(meme) => memeSelected(meme)}
        activeMeme={selectedName}
      />
    </ScrollView>
  );
};
