import { useState } from 'react'
import './index.css'

export function MakeBid({bid, onChangeOfBid, submitBid}){
  return(
    <div className='section'>
      
      <hr/>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <p>Bid</p>
        <input type={'number'} onChange = { e => onChangeOfBid(e.target.value) } value={bid}/>
        <hr/>
        <button className='button' onClick={submitBid}>Submit Bid</button>
      </div>
    </div>
  )
}