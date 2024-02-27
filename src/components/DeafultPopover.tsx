import { WrapperChildrenType } from '../types'

const DefaultPopover: WrapperChildrenType = ({ selection, removeSelection }) => {
  const handleDelete = () => {
    removeSelection(selection)
  }

  return (
    <div
      style={{
        padding: '1rem',
        boxShadow: '5px  5px  10px  0px rgba(0,  0,  0,  0.2)',
        backgroundColor: 'white',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}
      className='popover'
    >
      <p style={{ fontSize: '12px' }}>{selection.text.length} words selected</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <div onClick={handleDelete} className='cursor-pointer text-red-500'>
          {' '}
          &#x1F5D1;
        </div>
      </div>
    </div>
  )
}

export default DefaultPopover
