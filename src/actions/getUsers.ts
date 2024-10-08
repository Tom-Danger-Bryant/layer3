"use server";
import {  EtherscanProvider } from "ethers";
import { prisma } from '@/lib/prisma';


const USER_API = {
    "users": [
      {
        "rank": 1,
        "address": "0xF222f955Ecced246f3181d14fB4629469cEB7681",
        "avatarCid": "QmTUefEyqzfSugwvbCnTjzRdFvp4L5yA6qjEx1yspsr17z",
        "username": "yakugakusei.eth",
        "gmStreak": 248,
        "xp": 169164,
        "level": 41
      },
      {
        "rank": 2,
        "address": "0xc6571c2FB66825F13b7751b1c334810D397618Eb",
        "avatarCid": "QmUmDoDszD2GEdqYgkRi5DdTSd5cv4n8ih4akrdzGwWANm",
        "username": "pancopa.eth",
        "gmStreak": 283,
        "xp": 165396,
        "level": 40
      },
      {
        "rank": 3,
        "address": "0x1AFe8A03214Bf47300c2b3B7918ffDa98Fb359C8",
        "avatarCid": "QmQgW1EMVhpAzYQHJ8aJj5quDnYPFDf7RNcui2XiaMaqKL",
        "username": "arnoldcns.eth",
        "gmStreak": 329,
        "xp": 164654,
        "level": 40
      },
      {
        "rank": 4,
        "address": "0xd31A84c20bc430aD75E6a1903E7dDbee52211072",
        "avatarCid": "QmerjxnHa9wTmdMXfj7oo3FDgiRjHeSqTYWu4N82v71prf",
        "username": "harusame.eth",
        "gmStreak": 284,
        "xp": 163565,
        "level": 40
      },
      {
        "rank": 5,
        "address": "0x939780173b5D00b026A116dbDfE7b9f6F056Be9C",
        "avatarCid": "QmdqfrEwGcZFbYwJfiJDoWMdHLCdwRY5vb2TMMzoANzknW",
        "username": "moonrabbit380.eth",
        "gmStreak": 282,
        "xp": 161314,
        "level": 40
      },
      {
        "rank": 6,
        "address": "0x7c45FB10a18f834a47cc3F470E97140A399B6AF8",
        "avatarCid": "QmaBinkYwj4QyeZXXwVMgc6JGosEptf5vuSwDCJmTVybVx",
        "username": "umanuma.eth",
        "gmStreak": 4,
        "xp": 161014,
        "level": 40
      },
      {
        "rank": 7,
        "address": "0xfc46a7673e85F591337e50c260e184d8fD316A82",
        "avatarCid": "QmRFd8NbcbDNy4fNpsSzZW9S8cHfjU3Dg7hebttRkBvv1F",
        "username": "meowxixi.eth",
        "gmStreak": 295,
        "xp": 160465,
        "level": 40
      },
      {
        "rank": 8,
        "address": "0x97675D5D3fFd22401B78bA4C0a34fAAdd2039250",
        "avatarCid": "QmdDGf7ysLmj4KV9fpXy8DoCrdHbehgZpBYtEgPv18S6Q5",
        "username": "toraneko.eth",
        "gmStreak": 31,
        "xp": 159329,
        "level": 39
      },
      {
        "rank": 9,
        "address": "0x294C2a8BD233fAd3D9c29e9362A42f8881f4461B",
        "avatarCid": "QmSdriF1k2aLCfmDvZE921TthHftTCYvQHKSUgeK8Dakr5",
        "username": "bxxdefi.eth",
        "gmStreak": 20,
        "xp": 159072,
        "level": 39
      },
      {
        "rank": 10,
        "address": "0x5F1F6C7ae6944Ef82966365946C1eeb2Ea7a9505",
        "avatarCid": "Qmck7w7GiGSQCwraBV79EBzB8A8QNURo2hMGMZ5gpun9T1",
        "username": "izuma.eth",
        "gmStreak": 209,
        "xp": 158597,
        "level": 39
      }
    ]
  }

export const getUsers =  async () => {
    return USER_API;
};

export const getAvatar = async (ethName : string) => {
    const cacheAge : number =  (process.env.CACHE_AGE ? parseInt(process.env.CACHE_AGE) : 3600000);
    let cacheCheck : number  = Date.now() - cacheAge;
    try {
      let cachedAvatar = await prisma.avatar.findFirst({
        where : {
          ethAddress : ethName,
          updatedAt : {
            gte: new Date(cacheCheck)
          }
        }
      });
      if(cachedAvatar) {
        return cachedAvatar.url;
      }
      else {
      const provider = new EtherscanProvider('mainnet',process.env.ETHERSCAN_API_KEY)
      let avatar = await provider.getAvatar(ethName);
      if(avatar){
        await prisma.avatar.upsert({
          where : {
            ethAddress : ethName
          },
          update : {
            url : avatar
          },
          create: { 
            ethAddress : ethName,
            url : avatar,
          }
        });
      }
      return  avatar;
      } 
      } catch (e) {
        console.log(e);
          return null;
      }
    }

