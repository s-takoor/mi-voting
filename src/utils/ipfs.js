// ipfs.js
import ipfsAPI from 'ipfs-api';

const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' });

export default ipfs;

