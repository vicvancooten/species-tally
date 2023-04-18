import { IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { CounterType } from '../../Types'
import styles from './styles.module.scss'

import Icon from '@mdi/react'
import { mdiMinusBoxOutline, mdiPlusBoxOutline } from '@mdi/js'

const Counter: React.FC<{
  counter: CounterType
  onUpdateCounter: (c: CounterType) => void
  onDeleteCounter: () => void
}> = ({ counter, onUpdateCounter, onDeleteCounter }) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
  } | null>(null)

  return (
    <div
      className={styles.counter}
      onContextMenu={(event: React.MouseEvent) => {
        event.preventDefault()
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
              }
            : null
        )
      }}
    >
      <input
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className={styles.input}
        value={counter.label}
        onChange={(e) => {
          onUpdateCounter({ ...counter, label: e.target.value })
        }}
      />
      <div className={styles.count}>
        <IconButton
          onClick={(e) => {
            if (counter.count > 0)
              onUpdateCounter({ ...counter, count: counter.count - 1 })
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Icon path={mdiMinusBoxOutline} size={1} />
        </IconButton>{' '}
        <input
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className={styles.counterInput}
          step="1"
          value={counter.count}
          onChange={(e) => {
            onUpdateCounter({ ...counter, count: parseFloat(e.target.value) })
          }}
          type="number"
        />{' '}
        <IconButton
          onClick={() =>
            onUpdateCounter({ ...counter, count: counter.count + 1 })
          }
        >
          <Icon path={mdiPlusBoxOutline} size={1} />
        </IconButton>
      </div>
      <Menu
        open={contextMenu !== null}
        onClose={() => {
          setContextMenu(null)
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={(e) => {
            onDeleteCounter()
            setContextMenu(null)
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Counter
