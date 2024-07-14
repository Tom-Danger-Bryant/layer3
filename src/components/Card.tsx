"use server"
interface User {
    rank : number;
    address : string;
    avatarCid : string;
    username : string;
    gmStreak : number;
    xp : number;
    level : number
}

import { Suspense } from "react";
import { Avatar } from "./Avatar";
import { AvatarLoading } from "./AvatarLoading";
import Link from "next/link";

const Card = ({user} : {user : User}) => {
    return (
        <Link href={`user/${user.username}?address=${user.address}`}>
        <div data-test-id={`card-${user.username}`} className="border rounded-md shadow-md border-gray-200 bg-white">
                <Suspense fallback={<AvatarLoading/>}>
                    <Avatar name={user.username}/>
                </Suspense>
                <div className='flex flex-col p-6'>
                <p className='text-2xl font-bold self-end text-gray-400'>{`#${user.rank}`}</p>
                <p className='text-xl'>{user.username}</p>
                <p className='text-sm text-gray-700'>
                    <span>{`Level: ${user.level} `}</span>
                    <span className='text-xs'>{`(${user.xp} xp)`}</span>
                    </p>
                <p className='text-sm text-gray-700'>{`GM Streak: ${user.gmStreak}`}</p>
                </div>
        </div>
        </Link>
    )

}

export default Card;

export type {User};