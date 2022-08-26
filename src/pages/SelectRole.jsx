import './index.css'

export function SelectRole({deploy, attach}){
  return(
    <div className='section'>
      <button className='button' onClick={() => deploy()}>Create Auction</button>
      <hr />
      <button className='button' onClick={() => attach()}>Attach to existing auction</button>
    </div>
  )
}