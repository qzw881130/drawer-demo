import { memes } from "@/assets/list";
import trending from "@/assets/trending.json";
import axios from "axios";
import * as FileSystem from "expo-file-system";

export interface TrendingMeme {
  title: string;
  url: string;
  create_utc: number;
}

export interface Meme {
  name: string;
  image: any;
}

export const useApi = () => {
  const getTrending = async (): Promise<TrendingMeme[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(trending);
      }, 2000);
    });
  };

  const getMemes = async (): Promise<Meme[]> => {
    return new Promise((resolve, reject) => {
      let result: Meme[] = [];
      Object.entries(memes).forEach(([key, value]) => {
        result.push({
          name: key,
          image: value,
        });
      });
      console.log("memo result====", result);
      resolve(result);
    });
  };

  const createMeme = async (
    top: string,
    bottom: string,
    meme: string
  ): Promise<any> => {
    return axios.get(`https://ronreiter-meme-generator.p.rapidapi.com/meme`, {
      params: { top, bottom, meme },
      headers: {
        "x-rapidapi-key": process.env.EXPO_PUBLIC_RAPIDAPI_KEY,
        "x-rapidapi-host": "ronreiter-meme-generator.p.rapidapi.com",
      },
      responseType: "blob",
    });

    // return new Promise((resolve, reject) => {
    //   setTimeout(async () => {
    //     // const response = await axios.get(
    //     //   `https://upload.wikimedia.org/wikipedia/commons/b/b4/JPEG_example_JPG_RIP_100.jpg`,
    //     //   { responseType: "blob" }
    //     // );
    //     // resolve(response);
    //   }, 2000);
    // });
  };

  return {
    getTrending,
    getMemes,
    createMeme,
  };
};
