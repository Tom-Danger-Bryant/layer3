import Card from "@/components/Card";

import { getUsers } from "@/actions/getUsers";

export default async function Home() {
  const {users} = await getUsers(); 
   
  return (
  <div className="flex flex-col items-center bg-gray-100">
    <div className="my-4">
   <h1 className="text-3xl font-bold">Top Users</h1>
   </div>
   <div className="grid grid-cols-3 gap-4 px-4 w-full">
    {
      users.map((user,idx) => (
        <Card user={user} key={`usercard-${idx}`}/>
      ))
    }
   </div>
   </div>
   
  );
}
