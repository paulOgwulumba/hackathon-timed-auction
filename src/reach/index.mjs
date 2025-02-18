import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib();
const startingBalance = stdlib.parseCurrency(100);

console.log(`Creating test account for Creator`);
const accAuct = await stdlib.newTestAccount(startingBalance);

console.log(`Having creator create testing NFT`);
const theNFT = await stdlib.launchToken(accAuct, "bumple", "NFT", { supply: 1 });
const nftId = (theNFT.id);
const minimumBid = stdlib.parseCurrency(2);
const Timeout = 5;
const params = { nftId, minimumBid, Timeout };

let done = false;
const bidders = [];

const startBidders = async () => {
    let bid = minimumBid;

    const runBidder = async (who) => {
        const inc = stdlib.parseCurrency(Math.random() * 10);
        bid = bid.add(inc);

        const acc = await stdlib.newTestAccount(startingBalance);
        acc.setDebugLabel(who);
        await acc.tokenAccept(nftId);
        bidders.push([who, acc]);
        const ctc = acc.contract(backend, ctcAuct.getInfo());
        const getBal = async () => stdlib.formatCurrency(await stdlib.balanceOf(acc));

        console.log(`${who} decides to bid ${stdlib.formatCurrency(bid)}.`);
        console.log(`${who} balance before is ${await getBal()}`);
        try {
            const [ lastBidder, lastBid ] = await ctc.apis.Bidder.bid(bid);
            console.log(`${who} out bid ${lastBidder} who bid ${stdlib.formatCurrency(lastBid)}.`);
        } catch (e) {
            console.log(`${who} failed to bid, because the auction is over`);
        }
        console.log(`${who} balance after is ${await getBal()}`);
    };

    await runBidder('Alice');
    await runBidder('Bob');
    await runBidder('Claire');
    while ( !done ) {
        await stdlib.wait(1);
    }
};

const ctcAuct = accAuct.contract(backend);

// await ctcAuct.participants.Auctioneer({
//     initiateBid: () => {
//         console.log(`Auctioneer sets parameters of sale:`, params);
//         return params;
//     },
//     auctionReady: () => {
//         startBidders();
//     },
//     seeBid: (who, amt) => {
//         console.log(`Auctioneer saw that ${stdlib.formatAddress(who)} bid ${stdlib.formatCurrency(amt)}.`);
//     },
//     seeOutcome: (winner, amt) => {
//         console.log(`Auctioneer saw that ${stdlib.formatAddress(winner)} won with ${stdlib.formatCurrency(amt)}`);
//     },
// });

await backend.Auctiooner(ctcAuct, {
    initiateBid: () => {
        console.log(`Auctioneer sets parameters of sale:`, params);
        return params;
    },
    auctionReady: () => {
        setTimeout(() => {
            startBidders();
        }, 10000)
        console.log("Bid has started")
    },
    seeBid: (who, amt) => {
        console.log(`Auctioneer saw that ${stdlib.formatAddress(who)} bid ${stdlib.formatCurrency(amt)}.`);
    },
    seeOutcome: (winner, amt) => {
        console.log(`Auctioneer saw that ${stdlib.formatAddress(winner)} won with ${stdlib.formatCurrency(amt)}`);
    },
})

for ( const [who, acc] of bidders ) {
    const [ amt, amtNFT ] = await stdlib.balancesOf(acc, [null, nftId]);
    console.log(`${who} has ${stdlib.formatCurrency(amt)} ${stdlib.standardUnit} and ${amtNFT} of the NFT`);
}
done = true;