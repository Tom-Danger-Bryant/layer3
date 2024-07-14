import Card from "@/components/Card";

import { getUsers } from "@/actions/getUsers";

export default async function CardSection() {
 const {users} = await getUsers(); 
   
  return (
   <div className="grid grid-cols-3 gap-4 px-4 w-full">
    {
      users.map((user,idx) => (
        <Card user={user} key={`usercard-${idx}`}/>
      ))
    } 
   </div>
  );
}
