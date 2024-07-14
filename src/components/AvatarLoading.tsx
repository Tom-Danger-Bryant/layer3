import Image from "next/image"

export async function AvatarLoading() {

       
       return (<div className="h-[150px] w-full border-b border-slate-200 animate-pulse bg-slate-200 flex items-center justify-center">
                <Image 
                    className="opacity-20"
                    src="/eth-logo-sm.png"
                    width={100}
                    height={200}
                    alt='eth logo loader'
                    />

        </div>)

}

