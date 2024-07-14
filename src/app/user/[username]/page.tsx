
"use client"
import Gallery from "@/components/user/Gallery";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {

  const pathname = usePathname();
  const username = pathname.split('/')[2]; // /users/[username];
  const address = useSearchParams().get('address');
   
  return (
  <div className="flex flex-col items-center bg-gray-100">
     <Link className="self-start mt-2 ml-2" href="/">{`<- Leaderboard`}</Link>
    <div className="mb-6">
   <h1 className="text-3xl font-bold">{`${username} : NFT Gallery`}</h1>
   </div>
        <Gallery address={address as string}/>
   </div>

  );
}
