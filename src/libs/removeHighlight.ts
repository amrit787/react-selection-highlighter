import { SelectionType } from '../types'

export const removeHighlightFromDom = (selection: SelectionType) => {
  const element = document.getElementById(selection.id)

  const popover = document.getElementById(`pop-${selection.id}`)
  if (!element) return
  element.className = ''
  if (popover) {
    element.removeChild(popover)
  }
}
