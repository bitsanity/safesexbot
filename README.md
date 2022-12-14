# Safe Simple Ethereum Xchange roBot (SafeSEXBot)

SafeSEXBot is a collection of smart contracts and a user interface ("client")
program.

SafeSEXBot is a decentralized service enabling anyone to exchange ether, ERC20
tokens and ERC721 tokens (a.k.a. "NFTs").

SafeSEXBot also enables users to write and strike puts and calls, and these
contracts can be bought and sold within SafeSEXBot or any exchange that
supports NFTs and recognizes our token.

## RELEASE

User Interface safesexbot-ui-1.tgz:  
**IPFS Hash**: Qmb2Tpg67ZhTrdjpyMNrWidQqb3PzbSvMxXwqHtKgRMkpi

Smart Contract SCAs (Ethereum/mainnet):  
**ChitFactory**: 0x645e9ba771438Bd45E4756B21C6B04197C0BfAd5  
**ChitMarket**: 0x986B03C027C6Ededc5c85Bd267b4c34D31efe8e3  
**Chit (NFT)**: 0xAEd793393a0F8Ca285C21bf55244D17c29E11155  
**OptionFactory**:0xaEE9b3e8329B57e2192f4B70c7C3fB22A4C72F6E  
**OptionNFT**: 0x3308FCCcC757c491075A9CF974d34016DBEbefDa

## FEATURE: Asset Custody

Use CHITFACTORY to place an asset (ether, ERC20, or ERC721) to receive a CHIT.
Our CHIT is a standard ERC721 token that works like any NFT.

A CHIT owner can take (or "redeem") the asset from CHITFACTORY at any time.

## FEATURE: CHIT Trading

CHITMARKET is a Decentralized Exchange that trades assets but not options.

CHITMARKET requires no registration, no AMLKYC, has no token listing
requirement and has no trading fees. Users just pay for gas.

A trade generally proceeds as follows:

1. A Seller uploads an asset to CHITFACTORY and receives a CHIT.
2. Seller lists the CHIT for sale on CHITMARKET by creating an Ask.
3. Buyer sees the Ask. The Buyer uploads the payment item to CHITFACTORY and
   receives a CHIT to use for trade.
4. The Buyer makes an Offer for the Seller's Ask and commits the payment CHIT
   to CHITMARKET.
5. Seller approves the asset CHIT for CHITMARKET and accepts the Offer.
6. CHITMARKET swaps ownership of CHITs. Either party can redeem their CHIT or
   leave it within CHITMARKET for further trading.

## FEATURE: Options (Puts and Calls)

1. Maker uses OPTIONFACTORY to create an Option and place an asset as
   collateral. Maker receives an OPTIONNFT representing the contract.
2. The maker may sell the OPTIONNFT using CHITMARKET or any NFT exchange.
3. The eventual OPTIONNFT owner may choose to ignore the Option forever,
   cancel it or take it before the expiration date.
4. If the Option has passed expiration, the collateral can be retrieved by its
   maker.
6. If the Option has not expired, the taker may take the collateral by
   providing the settlement item.

## BENEFITS

* No sign-up required, no AMLKYC.
* Users are not forced to use MetaMask or webwallets.
* No restriction on token trades - but watch those SCAs carefully. Anyone can make an imposter token.
* Other than the program files in the installation bundle, no files are stored on the user's computer.
* No services required other than Internet and web3 service (not included)

## NOTES/WARNINGS

1. Users should inspect the source and confirm this program is unaltered. This
   program neither writes to disk nor transmits anything over the Internet
   except to the web3 gateway.
2. The user may provide a private key in raw hex format to the program in
   order to have it automatically sign Ethereum transactions. The private key
   can also be provided by pasting the contents of one's geth account file and
   entering the passphrase to decrypt it. The safest approach is to use our
   ADILOS keymaster, SIMPLETH is one, to sign transactions across the air gap
   and without revealing a private key at all.
3. This program increments the user's EVM account nonce each time it sends a
   transaction. Do not post transactions elsewhere using the same Ethereum
   account at the same time or this nonce may get out of sync.
   Simply restart this program if that happens.
4. All software can have bugs. No warranties. SafeSEXBot is not obligated for
   any damages resulting from use or abuse of this service. USE AT OWN RISK.
5. SafeSEXBot comes with no support.
6. Smart contract admin cannot take assets. Admin cannot interfere with or
   reverse trades. Please review the smart contract codes to confirm.
7. No privacy implemented. For that use Tornado Cash.

## RUNNING THE CLIENT

* Download and install latest version of NW.js.
* Extract the release zipped tarball e.g. `$ tar xf safesexbot-ui-1.tgz`
* `$ cd safesexbot\ui`
* `$ nw .`
* Go to the SETTINGS tab and specify your web3 gateway
* Go to the ACCOUNT tab and provide your key, geth file or do the ADILOS swap

The client is HTML and 100% javascript but npm modules may include
platform-specific binaries. The most likely source of trouble will be the
`node_modules` subdirectory. The release was prepared on x86 64-bit Linux.

Another source of potential trouble is we needed a small hack to the secp256k1
module to make it work in NW's slightly non-standard javascript engine.

Line 21-23 In `node_modules/secp256k1/lib/index.js`:

    function isUint8Array (name, value, length) {
     assert(    value instanceof Uint8Array
             || value.constructor.name === 'Uint8Array',

See https://github.com/cryptocoinjs/secp256k1-node/issues/175

