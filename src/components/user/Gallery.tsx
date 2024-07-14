import { useEffect,useState } from "react";
import  NFTTile  from './NFTTile';
import Image from "next/image";

export default function Gallery({address} : { address : string}) {

    const [nftList, setNftList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let res = await fetch(`/api/nft-list?address=${address}`);
            const data = await res.json();
            setNftList(data.result);
        })();
    },[])

    useEffect(()=> {
        if(nftList.length) {
            setLoading(false);
        }
    },[nftList])

  if(loading) {
    return <div className="h-screen w-full border-slate-200 animate-pulse bg-slate-200 flex items-center justify-center">
        <Image 
                    className="opacity-20"
                    src="/eth-logo-sm.png"
                    width={200}
                    height={400}
                    alt='eth logo loader'
                    />
    </div>    
  }
   
  return (
   <div className="grid grid-cols-5 gap-4 px-4 w-full">
    {
        nftList.map && nftList?.map(({tokenID, tokenName, contractAddress}, idx)=> (
            <NFTTile tokenId={tokenID} tokenName={tokenName} contractAddress={contractAddress} key={`nft-tile${idx}`}/>
        ))
    }

   </div>
  );
}
