# Leaderboard 

## Features
With this application you can view the top 10 users on Layer 3 and see their avatars and a gallery of some of their NFTs. You can access the gallery by clicking on a users tile


## Running The Application

### Setting up your ENV
use `.env.example` as an example of what variables you need to set.
I recommend following NextJs convention and adding a `.env.local`

You will need the following variables
`ETHERSCAN_API_KEY`= Your own etherscan api key to run the app (https://etherscan.io/)
`DATABASE_URL`="file:./layer3.db" - You can leave this as is, unless you want to use your own DB. 
`CACHE_AGE`=3600000 - this can also be left alone, unless you want to run without a cache, in that case set the value to 0;

### PNPM
This project uses `pnpm`. If you don't have pnpm on your machine you can install it through npm `npm i -g pnpm`. (npm will work on this application, but to use pnpm lockfile you'll need `pnpm`);

### Installation

`pnpm i --frozen-lockfile` 

### Running 
For the best experience build the app first
`pnpm run build`

`pnpm run start`

### Dev
You can run without building `pnpm run dev`


### Dockerfile
**I recommend running `pnpm run start` instead of docker**

There is a version of this application that runs in docker - however there is an issue with sqlite / prisma in the docker instance.

If you want to try the docker version just run 
`docker compose up`

You will likely encounter an issue with the cache where the `nfts` table cannot be found. 
- My current working theory is that this has to do with namespaces in prisma, and the NFT model isn't getting registered. 

## Design 
### Technology
I chose to build this app using tailwind & next js
The cache is powered by a simple sqlite db (file)
ethers.js powers the interactions with the chain
Where ethers lacked methods, I instead invoked etherscan as an api directly.

### Paragdigms
#### Server Side vs Client Side
There are a mixture of server side and client side components.
The Gallery is mainly client side and the leaderboard is predominatley server side. 
The choice between the two had to do with client side interaction ( I needed to know from the browser which gallery to view in order to get the queries)

Long term I'd like to move the gallery to server side, and use middleware to pass this info.

#### Apis vs Server Actions
I employ both apis and server actions. Ideally I would have liked to keep consistency and have all server actions, but the client components needed apis.

#### Rate Limits, Chain responsivness & Errors
Interacting with the chain proved challenging. There were many opportunities for failure, not limited to :
- Rate Limits (Free etherscan)
- Invalid Smart Contracts
- Chain Repsonsivness 
- Poor Data ( I need to implement a better way of identifying NFTs from ERC721 transactions )

I chose to implement a monad pattern (neverthrow) to handle the failures in the `getNFT` chain. This made error handling a little more sane & allowed me to whittle down cases.

#### Caching 
I chose to implement a basic cross-session cache using sqlite, this gives a better user experience, and reduces the calls made to the chain / 3rd party apis

#### Rate Limit Retries
When fetching the NFTs I found that I fell foul of the Etherscan rate limit (5 / sec) quite often. To combat this I added 5 retries (1 second apart). On each request. Although this isn't super friendly - I may debounce in the future. 


## To Do
Here's a list of what I'd like to do further to make the application more robust & give a better UX.

1. Stream images to blobs (and cache the blobs) - This cuts down on the client requests and would allow for more opportunities for incremental loaders
2. Move the cache to a better tech (a document db / redis)
3. Add debouncing / incremental backoff to the rate limit retries.
4. Explore how to get better data for the NFT listings
5. Give useful errors to the user (instead of on the console)
6. The original feature I had in mind was to take 2 nfts and use an AI api to generate a combined image. From there I'd like to mint the new combination nft. 

