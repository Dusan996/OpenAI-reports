import React, { useState, useEffect } from 'react'
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	TextField,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import {
	getReportsFromStorage,
	saveReportToStorage,
} from '../../utils/reportUtils'
import { ReportCard } from './ReportCard'
import { ReportForm } from './ReportForm'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { Report } from '../../types/report'
import { USER_ROLES } from '../../constants/roles'

import './ReportList.css'

export const ReportList: React.FC = () => {
	const { user } = useAuth()
	const [reports, setReports] = useState<Report[]>([])
	const [open, setOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [selectedReport, setSelectedReport] = useState<Report | undefined>(
		undefined,
	)

	useEffect(() => {
		setReports(getReportsFromStorage())
	}, [])

	const handleOpen = (report?: Report) => {
		setSelectedReport(report)
		setOpen(true)
	}

	const handleClose = () => {
		setSelectedReport(undefined)
		setOpen(false)
	}

	const handleSaveReport = (newReport: Report) => {
		let updatedReports: Report[]
		if (selectedReport) {
			updatedReports = reports.map((report) =>
				report.id === selectedReport.id ? newReport : report,
			)
		} else {
			updatedReports = [...reports, newReport]
		}
		setReports(updatedReports)
		saveReportToStorage(updatedReports)
		handleClose()
	}

	const handleDeleteReport = (id: string) => {
		const updatedReports = reports.filter((r) => r.id !== id)
		setReports(updatedReports)
		saveReportToStorage(updatedReports)
	}

	const sensors = useSensors(useSensor(PointerSensor))

	const handleDragEnd = ({ active, over }: any) => {
		if (!over || active.id === over.id) return

		const oldIndex = reports.findIndex((r) => r.id === active.id)
		const newIndex = reports.findIndex((r) => r.id === over.id)

		if (oldIndex !== -1 && newIndex !== -1) {
			const newReports = arrayMove(reports, oldIndex, newIndex)
			setReports(newReports)
			saveReportToStorage(newReports)
		}
	}

	const filteredReports = reports.filter((r) =>
		r.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()),
	)

	return (
		<Box sx={{ width: '100%', overflow: 'hidden' }}>
			<TextField
				className="search-field"
				label="Search title"
				variant="outlined"
				size="small"
				fullWidth
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<SortableContext items={reports.map((report) => report.id)}>
					<TableContainer component={Paper}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Title</TableCell>
									<TableCell>Content</TableCell>
									<TableCell>Created</TableCell>
									<TableCell>Edited</TableCell>
									<TableCell>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredReports.map((report) => (
									<ReportCard
										key={report.id}
										report={report}
										onEdit={handleOpen}
										onDelete={handleDeleteReport}
									/>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</SortableContext>
			</DndContext>
			{user.role === USER_ROLES.ADMIN && (
				<Button variant="contained" onClick={() => handleOpen()} sx={{ mt: 2 }}>
					Create Report
				</Button>
			)}
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<ReportForm
						onSave={handleSaveReport}
						report={selectedReport}
						onClose={handleClose}
					/>
				</DialogContent>
			</Dialog>
		</Box>
	)
}
