import { useState } from 'react'
import './index.css'

export function AuctionInfo({ bidders, winner, nftId, contractInfo }){
  const [ key, setKey ] = useState('')
  return(
    <div className='section'>
    <h4>Auction Information</h4>
    <p>{`NFT ID: ${nftId}`}</p>
    <p>{`Contract info: ${contractInfo}`}</p>
    {
        bidders.map((bidder) => {
            return (
                <div>
                    <p>
                        {`The address ${bidder.address} bid the amount ${bidder.amount}`}
                    </p>
                </div>
            )
        })
    }

    <div>
        <p>
            { winner.address.length > 0 ? `The address ${winner.address} won the bid with an amount of ${winner.amount}`: ''}
        </p>
    </div>
      
    </div>
  )
}