import CardSection from "@/components/CardSection";

export default async function Home() {
   
  return (
  <div className="flex flex-col items-center bg-gray-100">
    <div className="my-4">
   <h1 className="text-3xl font-bold">Top Users</h1>
   </div>
   <CardSection/>
   </div>

  );
}
