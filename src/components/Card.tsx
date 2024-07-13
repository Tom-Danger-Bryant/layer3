

interface User {
    rank : number;
    adddress : string;
    avatarCid : string;
    username : string;
    gmStreak : number;
    xp : number;
    level : 41
}


const _Card = ({user} : {user : User}) => {

    return (
        <div data-test-id={`card-${user.username}`} className="p-6 border rounded-md shadow-md border-gray-200 bg-white">
                <div className='flex flex-col'>
                <p className='text-2xl font-bold self-end text-gray-400'>{`#${user.rank}`}</p>
                <p className='text-xl'>{user.username}</p>
                <p className='text-sm text-gray-700'>
                    <span>{`Level: ${user.level} `}</span>
                    <span className='text-xs'>{`(${user.xp} xp)`}</span>
                    </p>
                <p className='text-sm text-gray-700'>{`GM Streak: ${user.gmStreak}`}</p>
                </div>
        </div>
    )

}

export default _Card;

export type {User};