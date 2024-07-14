"use server"
import { getAvatar } from "@/actions/getUsers";
import Image from "next/image";

export async function Avatar({ name="" } : {name : string}) {
    const avatar = await getAvatar(name);

    return (<div className="h-[150px] w-full border-b border-slate-200 flex items-center justify-center bg-sky-200">
        {avatar ? <img data-testid='has-avatar' className="object-cover w-full h-[150px] rounded-t-md"
            src={avatar} /> : <Image data-testid="no-avatar"
            src="/eth-logo-sm.png"
            width={100}
            height={200}
            alt='eth logo default'
        />}
    </div>)

}

