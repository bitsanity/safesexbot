STRINGS["English"].AboutText = `
-----------------------------------------------------------------
Safe Simple Ethereum Xchange roBot (SafeSEXBot) - version 0.2.0a
-----------------------------------------------------------------

SafeSEXBot is a collection of some smart contracts and this user interface program. It is a simple
decentralized service enabling anyone to exchange EVM-based assets and options.

Users and other smart contracts are welcome to interact with the smart contracts directly and also welcome to
build a different user interface that uses the smart contracts.

FEATURE: Asset Custody

1. Anyone can use CHITFACTORY to place an asset including Ether or any ERC20 or any ERC721 token and receive a
   CHIT in exchange.  A CHIT is a standard ERC721 token that works like any NFT.

   - There is a small flat fee to place an asset.

2. A CHIT owner can take (or "redeem") the asset from CHITFACTORY.

   - There is a small flat fee to remove an asset

The fees are adjustable by an admin motivated to keep them small to encourage use. The fees are published as
variables in the smart contracts and indicated in the Settings tab.


FEATURE: CHIT Trading

SafeSEXBot's CHIT contract is a standard ERC721 token that can be traded within SafeSEXBot's ChitMarket or on
any outside exchange that supports NFTs.

CHITMARKET requires no registration, no AMLKYC, has no token listing requirement and imposes no additional
trading fees.  Users merely pay for gas.

A trade generally proceeds as follows:

1. A Seller creates a CHIT for sale with CHITMARKET.
2. The Seller lists the CHIT for sale on CHITMARKET by creating an Ask.

   - An Ask can be canceled at any time before the sale completes.
   - The Seller may place multiple Asks for the same CHIT.
   - The seller may redeem the CHIT at any time. Any existing Asks and Offers still exist but will not function.

3. A Buyer sees the Ask and intends to purchase the Seller's asset. The Buyer places the payment item with
   CHITFACTORY and receives a CHIT to use as payment.

4. The Buyer makes an Offer for the Seller's Ask. This process commits the payment CHIT to the CHITMARKET
   contract.

   - The Offer amount must meet or exceed the Ask amount.
   - If the Ask item is an NFT, the tokenId must match.
   - The Buyer may redeem the payment CHIT or cancel the Offer any time before the sale completes.
   - A CHIT can be offered as payment for at most one Ask at any one time. Reusing a payment Chit to
     make a new Offer simply replaces the first Offer.

5. The sale completes when the Seller approves the asset CHIT for the smart contract and accepts
   an Offer.

   - The payment CHIT has already been approved for the CHITMARKET as part of making the Offer.
   - The accept logic swaps ownership of the CHITs.
   - The Seller and the Buyer may redeem their CHITs to retrieve the underlying assets, or leave them with
     CHITFACTORY for future trading.


FEATURE: Options (Puts and Calls)

1. One uses OPTIONFACTORY to create an Option and place an asset as collateral. An asset can be Ether, ERC20
   or ERC721.
2. The maker receives an OPTIONNFT as receipt for the collateral, as part of creating the Option.
3. The maker may trade the OPTIONNFT by any means. Note that CHITMARKET is a free decentralized way to trade
   OPTIONNFTs just like any other asset.
4. The eventual OPTIONNFT owner may cancel the Option, take it before the expiration date or simply ignore it
   forever.
5. If the Option has passed expiration, the collateral can be retrieved by the maker.
6. If the Option has not expired, the taker may take the collateral by providing the settlement item.


BENEFITS

+ No sign-up required, no AMLKYC.
+ Users are not forced to use MetaMask or webwallets.
+ No restriction on token trades - but watch those SCAs carefully. Anyone can make an imposter token.
+ Other than the program files in the installation bundle, no files are stored on the user's computer.
+ No services required other than Internet and web3 service (not included)


NOTES/WARNINGS

1. Users should inspect the source and confirm this program is unaltered. This program neither writes to
   disk nor transmits anything over the Internet except to the web3 gateway.

2. The user may provide a private key in raw hex format to the program in order to have it automatically sign
   Ethereum transactions.

   The private key can also be provided by pasting the contents of a geth account file and entering the
   passphrase to decrypt it.

   The safest approach is to use any ADILOS keymaster, SIMPLETH is one, to sign transactions across the air gap
   and without revealing a private key at all.

3. This program increments the user's EVM account nonce each time it sends a transaction. Do not post
   transactions elsewhere using the same Ethereum account at the same time or this nonce may get out of sync.
   Simply restart this program if that happens.

5. All software can have bugs. No warranties. SafeSEXBot is not obligated for any damages resulting from use
   or abuse of this service. USE AT OWN RISK.

6. SafeSEXBot comes with no support.

7. Owner cannot interfere with or reverse trades. Please review the smart contract codes to confirm.


SOFTWARE LICENSES

This client and all included products, including the SafeSEXBot smart contracts are all open source (MIT
License), and free to use for any purpose.


FEEDBACK / SUGGESTIONS

No promises. Send a simple transaction to the owner's address exposed as a variable in the smart contracts.
Assemble transaction as follows:

 {
   to:       <owner's address exposed as a smart contract variable>,
   value:    <tips will get your message noticed>,
   data:     <the message in hex-encoded UTF8. Remember, public blockchain>
   gas:      <include 21000 for the basic transfer plus 68 per byte of data>,
   gasPrice: <current market gas price>
 }
`;
