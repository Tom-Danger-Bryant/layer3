import { NextRequest } from "next/server";
import { err, ok, Result } from 'neverthrow';

const ETHERSCAN_API = 'https://api.etherscan.io/api';

const PAGE = 1;
const OFFSET = 10;

interface NFTItem {
    tokenName : string;
    tokenId : number | string;
    contractAddress : string;
}

interface NFTList {
    result : Array<Partial<NFTItem>>
}

const fetchList = async (address: string) : Promise<Result<NFTList, string>> => {
    try {
    const response = await fetch(`${ETHERSCAN_API}?module=account&action=tokennfttx&address=${address}&page=${PAGE}&offset=${OFFSET}&apikey=${process.env.ETHERSCAN_API_KEY}`);
    const NFTList = await response.json();
        return ok(NFTList);
    } catch (e) {
        console.log(e);
        return err('Cannot List NFTs')
    }
}

export const GET = async (request : NextRequest ) => {
    const address = request.nextUrl.searchParams.get("address");
    let getList = await fetchList(address as string);
    return getList.match(async (NFTList) => {
        return Response.json(NFTList);
    }, async(e)=> {
        return new Response(e, {
            status: 500
        });
    })
};

