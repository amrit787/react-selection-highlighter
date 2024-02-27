/* eslint-disable react/no-deprecated */
import ReactDOM from 'react-dom'

import HTMLReactParser from 'html-react-parser/lib/index'
import { addHighlight, isHighlightable } from '../../libs/addHighlight'
import { deserializeRange, serializeRange } from '../../libs/serialize'
import { MouseEventHandler, useCallback, useEffect } from 'react'
import { generateId } from '../../libs/uid'
import { getPopoverElement, getSpanElement } from '../../libs/wrapperElements'
import DefaultPopover from '../DeafultPopover'
import { useSelections } from '../../hooks/UseSelection'
import { SelectionType, WrapperChildrenType } from '../../types'

interface BaseHighlighterProps {
  htmlString: string
  minSelectionLength?: number
  maxSelectionLength?: number
  rootClassName?: string
  selections?: SelectionType[]
  selectionWrapperClassName?: string
  PopoverClassName?: string
  PopoverChildren?: WrapperChildrenType
  disablePopover?: boolean
  /**
   * The highlight color for the component.
   * @type {string} - The color code. Default is red.
   */
  highlightColor?: string
  onClickHighlight?: (selection: SelectionType) => void
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Highlighter: React.FC<BaseHighlighterProps> = ({
  htmlString,
  onClickHighlight,
  disablePopover,
  maxSelectionLength,
  minSelectionLength,
  rootClassName,
  PopoverChildren,
  PopoverClassName,
  highlightColor,
  selectionWrapperClassName,
  onClick,
}) => {
  const { selections, addSelection, removeSelection } = useSelections()
  const getWrapper = useCallback(
    (selection: SelectionType) => {
      const span = getSpanElement({ className: selectionWrapperClassName, highlightColor })
      if (!disablePopover) {
        const popover = getPopoverElement({ className: PopoverClassName })
        span.addEventListener('mouseover', () => {
          popover.style.visibility = 'visible'
          popover.style.opacity = '1'
        })
        span.addEventListener('mouseout', () => {
          popover.style.visibility = 'hidden'
          popover.style.opacity = '0'
        })
        span.id = selection.id
        popover.id = `pop-${selection.id}`
        span.appendChild(popover)

        span.onclick = () => {
          if (onClickHighlight) {
            onClickHighlight(selection)
          }
        }
        if (PopoverChildren) {
          ReactDOM.render(<PopoverChildren selection={selection} removeSelection={removeSelection} />, popover)
        } else {
          ReactDOM.render(<DefaultPopover removeSelection={removeSelection} selection={selection} />, popover)
        }
      }

      return span
    },
    [
      selectionWrapperClassName,
      PopoverClassName,
      disablePopover,
      highlightColor,
      onClickHighlight,
      PopoverChildren,
      removeSelection,
    ],
  )

  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (!selection) return
    if (minSelectionLength && selection.toString().length < minSelectionLength) return
    if (maxSelectionLength && selection.toString().length > maxSelectionLength) return
    const range = selection.getRangeAt(0)
    if (!isHighlightable(range)) return
    const newSelection: SelectionType = { meta: serializeRange(range), text: range.toString(), id: generateId() }
    addSelection(newSelection)
    // addHighlight(range,getWrapper(newSelection))
  }

  useEffect(() => {
    if (selections && selections.length) {
      selections.forEach(async (item) => {
        const range = await deserializeRange(item.meta)
        if (range) {
          addHighlight(range, getWrapper(item))
        }
      })
    }
  }, [selections, getWrapper])

  return (
    <div onClick={onClick} onMouseUp={handleMouseUp} className={rootClassName}>
      {HTMLReactParser(htmlString)}
    </div>
  )
}

export default Highlighter
