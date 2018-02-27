
    import { Connect, SimpleSigner } from 'uport-connect'

    const uport = new Connect('Caspar\'s new app', {
      clientId: '2onfFX8r83aXfqz6znusYgf73TpMPNvT1GS',
      network: 'rinkeby or ropsten or kovan',
      signer: SimpleSigner('0517d941ec5c6345820343938ba917a575112ff50f3fcae6c9800bb270063277')
    })

    // Request credentials to login
    uport.requestCredentials({
      requested: ['name', 'phone', 'country'],
      notifications: true // We want this if we want to recieve credentials
    })
    .then((credentials) => {
      // Do something
    })

    // Attest specific credentials
    uport.attestCredentials({
      sub: THE_RECEIVING_UPORT_ADDRESS,
      claim: {
        CREDENTIAL_NAME: CREDENTIAL_VALUE
      },
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    })
    