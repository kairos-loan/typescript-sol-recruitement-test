import { generatePrivateKey } from 'viem/accounts'

const privateKey = generatePrivateKey();
console.log("Private Key", privateKey);