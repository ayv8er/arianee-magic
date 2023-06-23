import Web3 from "web3";
import { magic } from "./magic";
import { ethers } from "ethers";

export const web3 = new Web3(magic.rpcProvider);
export const ethersProvider = new ethers.BrowserProvider(magic.rpcProvider);

