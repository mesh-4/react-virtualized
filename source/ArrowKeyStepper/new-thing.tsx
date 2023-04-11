import * as React from 'react'
import { polyfill } from 'react-lifecycles-compat'

import type { ArrowKeyStepperProps } from './types'

const ArrowKeyStepper = ({
	children,
	className,
	columnCount,
	disabled = false,
	isControlled = false,
	mode = 'edges',
	onScrollToChange,
	rowCount,
	scrollToColumn: initialScrollToColumn = 0,
	scrollToRow: initialScrollToRow = 0,
}: ArrowKeyStepperProps) => {
	const [scrollToColumn, setScrollToColumn] = React.useState(initialScrollToColumn)
	const [scrollToRow, setScrollToRow] = React.useState(initialScrollToRow)
	const [instanceProps, setInstanceProps] = React.useState({
		prevScrollToColumn: initialScrollToColumn,
		prevScrollToRow: initialScrollToRow,
	})

	const [sectionRendered, setSectionRendered] = React.useState({
		columnStartIndex: 0,
		columnStopIndex: 0,
		rowStartIndex: 0,
		rowStopIndex: 0,
	})

	React.useEffect(() => {
		if (!isControlled) {
			if (
				initialScrollToColumn !== instanceProps.prevScrollToColumn ||
				initialScrollToRow !== instanceProps.prevScrollToRow
			) {
				setScrollToColumn(initialScrollToColumn)
				setScrollToRow(initialScrollToRow)
				setInstanceProps({
					prevScrollToColumn: initialScrollToColumn,
					prevScrollToRow: initialScrollToRow,
				})
			}
		}
	}, [initialScrollToColumn, initialScrollToRow, isControlled, instanceProps])

	const onKeyDown = React.useCallback(
		(event) => {
			if (disabled) {
				return
			}

			let newScrollToColumn = scrollToColumn
			let newScrollToRow = scrollToRow

			switch (event.key) {
				case 'ArrowDown':
					newScrollToRow =
						mode === 'cells'
							? Math.min(scrollToRow + 1, rowCount - 1)
							: Math.min(sectionRendered.rowStopIndex + 1, rowCount - 1)
					break

				case 'ArrowLeft':
					newScrollToColumn =
						mode === 'cells' ? Math.max(scrollToColumn - 1, 0) : Math.max(sectionRendered.columnStartIndex - 1, 0)
					break

				case 'ArrowRight':
					newScrollToColumn =
						mode === 'cells'
							? Math.min(scrollToColumn + 1, columnCount - 1)
							: Math.min(sectionRendered.columnStopIndex + 1, columnCount - 1)
					break

				case 'ArrowUp':
					newScrollToRow =
						mode === 'cells' ? Math.max(scrollToRow - 1, 0) : Math.max(sectionRendered.rowStartIndex - 1, 0)
					break
			}

			if (newScrollToColumn !== scrollToColumn || newScrollToRow !== scrollToRow) {
				event.preventDefault()

				if (typeof onScrollToChange === 'function') {
					onScrollToChange({
						scrollToColumn: newScrollToColumn,
						scrollToRow: newScrollToRow,
					})
				}

				if (!isControlled) {
					setScrollToColumn(newScrollToColumn)
					setScrollToRow(newScrollToRow)
				}
			}
		},
		[
			columnCount,
			disabled,
			isControlled,
			mode,
			onScrollToChange,
			rowCount,
			scrollToColumn,
			scrollToRow,
			sectionRendered.columnStartIndex,
			sectionRendered.columnStopIndex,
			sectionRendered.rowStartIndex,
			sectionRendered.rowStopIndex,
		]
	)

	const onSectionRendered = React.useCallback(({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) => {
		setSectionRendered({
			columnStartIndex,
			columnStopIndex,
			rowStartIndex,
			rowStopIndex,
		})
	}, [])

	const getScrollState = React.useCallback(() => {
		return isControlled
			? { scrollToColumn: initialScrollToColumn, scrollToRow: initialScrollToRow }
			: { scrollToColumn, scrollToRow }
	}, [isControlled, initialScrollToColumn, initialScrollToRow, scrollToColumn, scrollToRow])

	const { scrollToColumn: finalScrollToColumn, scrollToRow: finalScrollToRow } = getScrollState()

	return (
		<div className={className} onKeyDown={onKeyDown}>
			{children({
				onSectionRendered,
				scrollToColumn: finalScrollToColumn,
				scrollToRow: finalScrollToRow,
			})}
		</div>
	)
}

polyfill(ArrowKeyStepper)

export default ArrowKeyStepper
