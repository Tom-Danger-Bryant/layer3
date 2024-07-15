import { NextRequest } from "next/server";
import { EtherscanProvider, ethers } from "ethers";
import { ok, err,Result } from 'neverthrow'
import  {prisma}  from '@/lib/prisma';


const ETHERSCAN_API = 'https://api.etherscan.io/api';

function sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
;}


const RATE_LIMIT_ERROR = 'Max rate limit reached';


const grabABI = async (contractAddress : string, retries : number) : Promise<Result<ethers.InterfaceAbi , string>> => {
    try {
        const response = await fetch(`${ETHERSCAN_API}?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`);
        const data = await response.json();
        const { message,result } = data;
        if(message !== 'OK' && retries) {
            if(result === RATE_LIMIT_ERROR){
                await sleep(1000);
                return await grabABI(contractAddress,retries-1);
            } else {
                return err('Could not grab ABI');
            }
        } else {
            return ok(data.result)
        }
    } catch (e) {
        return err('Could not grab ABI')
    }
}

const getTokenLocation = async (contractAddress : string, abi : ethers.InterfaceAbi, tokenId : string | number) : Promise<Result<string,string>> => {
    const provider = new EtherscanProvider('mainnet',process.env.ETHERSCAN_API_KEY)
    let contract = new ethers.Contract(contractAddress, abi, provider);
    if(!contract.tokenURI) {
        return err('No tokenURI method on this contract')
    } else {
        try {
        let tokenInfo = await contract.tokenURI(tokenId);
        if(tokenInfo.split('ipfs://').length > 1) tokenInfo = IPFSRewrite(tokenInfo);
        return ok(tokenInfo)
        } catch (e) {
            console.log(e.message);
            return err('error envoking tokenURI');
        }
    }
}

const getImageAddressFromLocation = async (url : string ) : Promise<Result<string,string>> => {
    try {
        const imageGrab = await fetch(url);
        if(imageGrab.status === 200) {
            const imageLocation = await imageGrab.json();
            if(imageLocation.image.split('ipfs://').length > 1) imageLocation.image = IPFSRewrite(imageLocation.image);
            return ok(imageLocation.image);
        } else {
            return err('Could not reach image url')
        }
    } catch (e) {
        return err('failed to fetch image from url')
    }
}



const grabNFT = async ( tokenId: string | number, contractAddress : string, retries : number ) => {
            const res = await grabABI(contractAddress,retries)
            
            return res.match(async (abi: ethers.InterfaceAbi)=> {
                let locationResult = await getTokenLocation(contractAddress,abi,tokenId)
                return locationResult.match(async (location) =>{
                    let imageAddressResult = await getImageAddressFromLocation(location);
                    return imageAddressResult.match((image) => image, (err)=> {
                        console.log(err);
                        return null;
                    })
                }, async (err) => {
                    console.log(err);
                    return null;
                })
            },
            async (err: string) => {
                console.log(err);
            return null;
}
)
}



const IPFSRewrite = (ipfsUrl : string ) => {
    const base =  ipfsUrl.split('ipfs://')[1];
    return `https://gateway.ipfs.io/ipfs/${base}`
}




export const POST = async (request : NextRequest ) => {
    const { tokenName, tokenId, contractAddress } =  await request.json();
    const cacheAge : number =  (process.env.CACHE_AGE ? parseInt(process.env.CACHE_AGE) : 3600000);
    let cacheCheck : number  = Date.now() - cacheAge;

    const cached = await prisma.NFT.findFirst({
            where : {
                contractAddress : contractAddress,
                tokenId : tokenId,
                updatedAt : {
                    gte: new Date(cacheCheck)
                }
            }
        });
        if(cached) {
            return Response.json({
                tokenName,
                result : { 
                    image : cached.url
                }
            })
        } else {
            const result = await grabNFT(tokenId, contractAddress, 5);
                if(result){
                    await prisma.NFT.upsert({
                        where : {
                            tokenId_contractAddress : {
                                contractAddress : contractAddress,
                                tokenId : tokenId
                            }
                        },
                        update : {
                            url : result
                        },
                        create : {
                            contractAddress,
                            tokenId,
                            url : result
                        }
                    });
                }

            return Response.json({
                tokenName,
                result : result ? {image : result} : null
        });
        }
};



