import { useEffect,useState } from "react";
import Image from "next/image";

interface nftDetails {
    result : {
        image : string;
    }
}

export default function NFTTile({tokenName, tokenId, contractAddress } : { tokenName : string , tokenId : string , contractAddress : String }) {

    const [nftDetails, setNftDetails] = useState<Partial<nftDetails>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let res = await fetch(`/api/nft`,{
                method : 'POST',
                body : JSON.stringify({tokenName, tokenId, contractAddress})
            });
            const data = await res.json();
            setNftDetails(data);
        })();
    },[]);

    useEffect(() => {
        if(nftDetails && nftDetails.result) {
            setLoading(false);
        }
    },[nftDetails])




  return (
   <div className="border rounded-md shadow-md border-gray-200 bg-white h-80 flex flex-col">
            {loading && <div className="flex grow animate-pulse bg-slate-200 flex items-center justify-center">
                <Image 
                    className="opacity-20"
                    src="/eth-logo-sm.png"
                    width={100}
                    height={200}
                    alt='eth logo loader'
                    /></div>}
            {nftDetails.result ? <img className="flex grow object-cover max-h-[80%]" src={nftDetails.result.image}/> : <></>}
            <div className="w-full h-[20%] self-end flex justify-center text-center"><p className="text-sm">{`${tokenName} ${tokenId}`}</p></div>
   </div>
  );
}
