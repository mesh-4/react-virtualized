import type { RenderedSection } from '../Grid'

export type ScrollIndices = {
	scrollToColumn: number
	scrollToRow: number
}

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
type ChildrenParams = {
	onSectionRendered: (params: RenderedSection) => void
	scrollToColumn: number
	scrollToRow: number
}

export type ArrowKeyStepperProps = {
	children: (params: ChildrenParams) => React.ReactElement<any>
	className?: string
	columnCount: number
	disabled: boolean
	isControlled: boolean
	mode: 'cells' | 'edges'
	onScrollToChange?: (params: ScrollIndices) => void
	rowCount: number
	scrollToColumn: number
	scrollToRow: number
}

export type ArrowKeyStepperState = ScrollIndices & {
	instanceProps: {
		prevScrollToColumn: number
		prevScrollToRow: number
	}
}
