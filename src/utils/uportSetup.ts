import { Connect, SimpleSigner } from 'uport-connect';
const uport = new Connect('LifeMesh', {
  clientId: '2onfFX8r83aXfqz6znusYgf73TpMPNvT1GS',
  signer: SimpleSigner('0517d941ec5c6345820343938ba917a575112ff50f3fcae6c9800bb270063277')
})

const web3 = uport.getWeb3()
export { web3, uport }
