/* eslint-disable no-undef */
'reach 0.1';

export const main = Reach.App(() => {
    const Auctiooner = Participant('Auctiooner', {
          initiateBid: Fun([], Object({
               nftId: Token,
               Timeout: UInt,
               minimumBid: UInt,
          })),
          seeOutcome:Fun([Address, UInt], Null),
          seeBid:Fun([Address, UInt], Null),
          auctionReady: Fun([], Null)

    });
    const Bidder = API('Bidder', { 
        bid:Fun([UInt],Tuple(Address,UInt))
     });
     init();

    Auctiooner.only(() =>{
        const { nftId, Timeout,minimumBid} = declassify( interact.initiateBid())
    })

    Auctiooner.publish(nftId, Timeout,minimumBid)
    .timeout(false);
    const amt = 1
    commit();

    Auctiooner.pay([[amt,nftId]]);

    Auctiooner.interact.auctionReady();

    assert(balance(nftId)== amt,"balance of NFT is wrong")
    
    const [ timeRemaining, keepGoing ] = makeDeadline(Timeout)
    
       //let them fight for bid
     const [ winner, currentPrice, isFirstBid  ] = 
     parallelReduce([ Auctiooner, minimumBid, true ])
       .invariant(balance(nftId) == amt)
       .invariant(balance() == (isFirstBid ? 0 : currentPrice))
       .while(keepGoing())
       .api_(Bidder.bid, (bid) =>{
        check(bid > currentPrice );
        return [ bid, (notify) => {
        notify([winner, currentPrice]);
        if( !isFirstBid ){
            transfer(currentPrice).to(winner);
        }
        const who = this;
        Auctiooner.interact.seeBid(who,bid);
        return [who, bid, false];
        }]
       })
        .timeout(timeRemaining(), () => {
           Auctiooner.publish();
           return [ winner, currentPrice, isFirstBid ]
        });
        transfer(amt, nftId).to(winner);
        if( !isFirstBid ){
            transfer(currentPrice).to(Auctiooner);
        }
        Auctiooner.interact.seeOutcome(winner, currentPrice);
    commit();
    exit();
});
