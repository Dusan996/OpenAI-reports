import React from 'react'
import { TableRow, TableCell, Typography, IconButton } from '@mui/material'
import { Report } from '../../types/report'
import { useAuth } from '../../context/AuthContext'

import { USER_ROLES } from '../../constants/roles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import './ReportCard.css'

interface ReportCardProps {
	report: Report
	onEdit: (report: Report) => void
	onDelete: (id: string) => void
}

export const ReportCard: React.FC<ReportCardProps> = ({
	report,
	onEdit,
	onDelete,
}) => {
	const { user, addActivity } = useAuth()
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useSortable({
			id: report.id,
		})

	const handleDelete = () => {
		if (user.role === USER_ROLES.ADMIN) {
			onDelete(report.id)
			addActivity(`${user.username} deleted report "${report.title}"`)
		}
	}

	const handleEdit = () => {
		if (user.role === USER_ROLES.ADMIN) {
			onEdit(report)
		}
	}

	const style = {
		transform: CSS.Transform.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	}

	const formatDate = (date: Date) => {
		return date.toISOString().replace('T', ' ').substring(0, 19)
	}

	return (
		<TableRow ref={setNodeRef} style={style}>
			<TableCell className="cell-content" {...attributes} {...listeners}>
				<Typography variant="body1" gutterBottom>
					{report.title}
				</Typography>
			</TableCell>
			<TableCell className="cell-content" {...attributes} {...listeners}>
				<Typography variant="body1" gutterBottom>
					{report.content}
				</Typography>
			</TableCell>
			<TableCell className="cell-content" {...attributes} {...listeners}>
				<Typography variant="caption" color="textSecondary">
					{report.createdAt instanceof Date
						? formatDate(report.createdAt)
						: 'N/A'}
				</Typography>
			</TableCell>
			<TableCell className="cell-content" {...attributes} {...listeners}>
				<Typography variant="caption" color="textSecondary">
					{report.updatedAt instanceof Date
						? formatDate(report.updatedAt)
						: 'N/A'}
				</Typography>
			</TableCell>
			<TableCell className="row-action">
				{user.role === USER_ROLES.ADMIN && (
					<>
						<IconButton
							onClick={handleEdit}
							color="primary"
							disabled={isDragging}>
							<EditIcon />
						</IconButton>
						<IconButton
							onClick={handleDelete}
							color="error"
							disabled={isDragging}>
							<DeleteIcon />
						</IconButton>
					</>
				)}
			</TableCell>
		</TableRow>
	)
}
