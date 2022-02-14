import { create } from 'ipfs-http-client'

const ipfs = create(new URL("ipfs.infura.io:5001"))

export default ipfs;