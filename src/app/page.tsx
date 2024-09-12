'use client';
import Image from "next/image";
import Link from "next/link";
import { useWriteContract } from 'wagmi'
import { getInfura, staabi, staadd, testabi, testadd } from './abi'
import '@rainbow-me/rainbowkit/styles.css';
import { useReadContract } from 'wagmi'
import { Button, message } from 'antd';
import { usePrepareTransactionRequest, useSendTransaction } from 'wagmi'
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { useAccount, WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";
import { createPublicClient, http, parseEther } from "viem";
import { readContract } from "viem/actions";
const client = createPublicClient({
  chain: sepolia,  // 或你所连接的网络
  transport: http(),  // 使用 HTTP 作为传输层
});
const contract = getInfura(staadd , staabi)
const TabButton = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-t-lg transition-colors duration-300 ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  );
};

// STAKING Tab 内容
const StakeUnstakeTab = ({ isStaking, toggleStaking }) => {
  const {address, status, isConnecting} = useAccount();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const { writeContract } = useWriteContract()
  const { data, isError, isLoading } = useReadContract({
    address: staadd,
    abi: staabi,
    functionName: 'getBalance',
    args: [address],
  })
  const { dat} = useReadContract({
    address: staadd,
    abi: staabi,
    functionName: 'getStakedBalance',
    args: [address],
  })
  const functionName = isStaking ? 'stakeTokens' : 'unstakeTokens'; // 切换调用的合约函数
  const actionLabel = isStaking ? 'Stake' : 'Unstake'; // 切换按钮显示的文本

  // const { config } = usePrepareContractWrite({
  //   address: contractAddress,
  //   abi: contractABI,
  //   functionName: functionName,
  //   args: [amount],
  // });

  // const { write } = useContractWrite(config);

  const handleAction = () => {
    if (!amount || amount <= 0) {
      setMessage(`Please enter a valid amount to ${actionLabel.toLowerCase()}.`);
      return;
    }

    try {
      // 将用户输入的 amount 转换为链上的最小单位（假设代币有 18 位小数）
      const formattedAmount = amount * (10 ** 18)
      if (isStaking) {
        writeContract({
          address: staadd,
          abi: staabi,
          functionName: 'stake',
          args: [formattedAmount],
        });
      } else {
        writeContract({
          address: staadd,
          abi: staabi,
          functionName: 'unstake',
          args: [formattedAmount],
        });
      }

    } catch (error) {
      console.error('Transaction failed:', error);
      setMessage(`Failed to ${actionLabel.toLowerCase()}. Please try again.`);
    }
  }
  const cur =1
  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-4">{actionLabel} Your Tokens ({" account "}{cur}GC)</h2>
      <div className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent border-none text-3xl outline-none w-full mb-4 p-2"
          placeholder={`Enter amount to ${actionLabel.toLowerCase()}`}
        />
        <button
          onClick={handleAction}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white w-full py-3 rounded-lg"
        >
          {actionLabel} Tokens
        </button>

        {/* 切换 Staking 和 Unstaking 的箭头按钮 */}
        <div className="flex justify-center mt-4">
          <button onClick={toggleStaking} className="text-blue-500">
            {isStaking ? '↕ Switch to Unstake' : '↕ Switch to Stake'}
          </button>
        </div>

        {message && <p className="text-green-400 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default function Home() {
  const {address, status, isConnecting} = useAccount();
  const [activeTab, setActiveTab] = useState('airdrop');
  const [isStaking, setIsStaking] = useState(true); // 控制质押和提取的切换状态
  const [num, setnum] = useState();
  const { writeContract } = useWriteContract()
  // const { data} = useReadContract()
  
  const toggleStaking = () => {
    setIsStaking(!isStaking); // 切换质押/提取状态
  };

  const claim = ()=>{
    if(status == "connected") {
      message.error("The total interest is 0. We will send airdrop every month.")
    }
  }
  // 准备发送交易的参数
  const air = ()=>{
    if(status == "connected") {
      writeContract({
        address: staadd,
        abi: staabi,
        functionName: 'mint',
        args: [address, 10000000000000000000000000],
      })
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:p-4 lg:dark:bg-zinc-800/30">
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ConnectButton />
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-4">
        <div className="flex mb-4">
          <TabButton isActive={activeTab === 'airdrop'} onClick={() => setActiveTab('airdrop')}>
            Airdrop
          </TabButton>
          <TabButton isActive={activeTab === 'staking'} onClick={() => setActiveTab('staking')}>
            Stake/Unstake
          </TabButton>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full">
          {activeTab === 'airdrop' && (
            <div className="text-white">
              <h2 className="text-xl font-bold mb-4">Claim Your Airdrop</h2>
              {/* Airdrop 相关内容 */}
              <div className="space-y-4">
                <input
                  type="text"
                  className="bg-transparent border-none text-3xl outline-none w-full mb-4 p-2"
                  placeholder="10000000GC"
                  readOnly
                />
                <button onClick={air}className="bg-gradient-to-r from-blue-500 to-green-500 text-white w-full py-3 rounded-lg">
                  Claim Airdrop
                </button>
              </div>
            </div>
          )}
          {activeTab === 'staking' && (
            <StakeUnstakeTab isStaking={isStaking} toggleStaking={toggleStaking} />
          )}
        </div>
      </div>
      <div className="flex-col font-extrabold text-[50px] elative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <p>Token Address: 0xe1c78c06e415d33ded458a0c47dd17c3db1419b0</p>
        <p>Your Interest: 0 GC</p>
      </div>
      <button onClick={claim} className="z-20 bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer w-50 text-3xl">
          claim
      </button>
    </main>
  );
}
