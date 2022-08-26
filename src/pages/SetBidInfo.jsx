import { useState } from 'react'
import './index.css'

export function SetBidInfo({timeout, minimumBid, handleTimeoutChange, handleMinimumBidChange, handleContinue }){
    return(
        <div className='section'>
        
        <hr/>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <p>Timeout </p>
            <input type={'number'} onChange = { e => handleTimeoutChange(e.target.value) } value={timeout}/>
            <hr/>
            <p>Minimum Bid</p>
            <input type={'number'} onChange = { e => handleMinimumBidChange(e.target.value) } value={minimumBid}/>
            <hr/>
            <button className='button' onClick={handleContinue}>Start Auction</button>
        </div>
        </div>
  )
}