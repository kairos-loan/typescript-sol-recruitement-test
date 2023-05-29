import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'viem';
import { ecsign, toBuffer } from 'ethereumjs-util';

const privateKey = '0x772aa31804bb89c31606610ab0682020f97ef581ad3b8742b8898a8218de8864'; // GENERATED FOR TEST


const nftA = "0xcF0e5f9345751A3Dc76a9ec1EC7593ac1A08615d";
const nftB = "0x2439f2011d17822E827D934cB814E56279632133";
async function generate() {
    const nfts = [`${nftA.toLocaleLowerCase()}1`, `${nftB.toLowerCase()}1`,`${nftA.toLowerCase()}2`, `${nftA.toLowerCase()}4`];

    const leaves = nfts.map(nft => {
        const data = nft;
        return keccak256(Buffer.from(data));
    });
    const tree = new MerkleTree(leaves, keccak256, { sort: true});
    const root = tree.getRoot().toString('hex');
    console.log(`Merkle root: ${root}`);

    const proof = tree.getHexProof(leaves[0]);
    console.log("Proof for NFTA-1", proof);

    const isValidProof = tree.verify(proof, leaves[0], root);
    if (!isValidProof) {
        console.log('The proof is not valid.');
        return false;
    }

    // SIGNING WITH VIEM (NOT USED)

    // const hashWithPrefix = (message) => {
    //     const messageBytes = stringToBytes(message);
    //     const prefixBytes = stringToBytes(`\x19Ethereum Signed Message:\n${messageBytes.length}`,)
    //     return keccak256(concat([prefixBytes, messageBytes]))
    // }
    // const messagePrefix = hashWithPrefix(root);
    //
    // const signature = await walletClient.signMessage({
    //     account, message: root,
    // });
    //
    // const signatureBuffer = toBuffer(signature);
    // const {v, r, s} = fromRpcSig(signatureBuffer);
    //
    // console.log("Message", root);
    // console.log("Message Prefix", messagePrefix);
    // console.log(`Signature v:${v}, r:${r.toString('hex')}, s:${s.toString('hex')}`);

    const signatureSimplified = ecsign(toBuffer(`0x${root}`), toBuffer(privateKey));
    console.log(`Signature: v=${signatureSimplified.v.toString()}, r=${signatureSimplified.r.toString('hex')}, s=${signatureSimplified.s.toString('hex')}`);
}

generate();