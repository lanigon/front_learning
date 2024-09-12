"use client";

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { useEffect, useState } from 'react'
 
// 2. Set up your client with desired chain & transport.

 
// 3. Consume an action!


export default function Test() {
  const [blocknumber, setBlockNumber] = useState(0)

  useEffect(() => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    })
    const get = async() => {
      const blocknumber = await client.getBlockNumber()
      setBlockNumber(blocknumber)
      console.log(blocknumber)
    }
    
    get()
  },[])

  return (
    <div className="text-3xl flex justify-center min-h-screen items-center">test{blocknumber}</div>
  );
}