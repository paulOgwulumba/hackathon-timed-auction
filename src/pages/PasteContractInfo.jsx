import { useState } from 'react'
import './index.css'

export function PasteContractInfo({attach, account, reach}){
  const [ info, setInfo ] = useState('')
  const [nftId, setNftId] = useState(0);

  const acceptToken = async () => {
    try {
      await account.tokenAccept(nftId);
      attach(info);
    }
    catch(e) {
      console.log(e)
      alert('Invalid token id supplied');
    }
  }

  return(
    <div className='section' style={{display: 'flex', flexDirection: 'column'}}>
      <h5>Paste Contract Info</h5>
      <textarea className='textarea' onChange={e => setInfo(e.target.value)}/>

      <h5>Paste NFT ID</h5>
      <input type={'number'} onChange={e => setNftId(e.target.value)} value={nftId}/>
      
      <button className='button' onClick={acceptToken}>Attach To Contract</button>
    </div>
  )
}