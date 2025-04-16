import React, { useState, useEffect } from 'react'
import {
	Box,
	Button,
	TextField,
	Typography,
	CircularProgress,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { createReport, updateReport } from '../../utils/reportUtils'
import { Report } from '../../types/report'
import { useOpenAI } from '../../hooks/useOpenAI'

interface ReportFormProps {
	report?: Report
	onClose: () => void
	onSave: (newReport: Report) => void
}

export const ReportForm: React.FC<ReportFormProps> = ({
	report,
	onClose,
	onSave,
}) => {
	const { user, addActivity } = useAuth()
	const [title, setTitle] = useState(report?.title || '')
	const [content, setContent] = useState(report?.content || '')
	const [prompt, setPrompt] = useState('')
	const [error, setError] = useState<string | null>(null)

	const {
		loading: generating,
		error: generateError,
		data: aiData,
		callAPI: generateDraft,
	} = useOpenAI({
		endpoint: '/chat/completions',
		data: {
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: report
						? `Summarize the following report titled "${report.title}":\n\n${report.content}`
						: `Write a report titled "${title}". ${
								prompt ? `Prompt: ${prompt}` : ''
						  }`,
				},
			],
		},
	})

	const handleGenerateDraft = async () => {
		await generateDraft()
	}

	useEffect(() => {
		if (aiData?.choices?.[0]?.message?.content) {
			setContent(aiData.choices[0].message.content.trim())
		}
	}, [aiData])

	const handleSubmit = () => {
		if (!title || !content) {
			setError('Title and content are required')
			return
		}

		let newReport: Report
		if (report) {
			newReport = updateReport(report, title, content)
			addActivity(`${user.username} edited report "${title}"`)
		} else {
			newReport = createReport(title, content)
			addActivity(`${user.username} created report "${title}"`)
		}

		onSave(newReport)
		setError(null)
	}

	const aiBtnText = report ? 'Summarize Content' : 'Generate Draft'

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h5" gutterBottom>
				{report ? 'Edit Report' : 'Create Report'}
			</Typography>

			<TextField
				label="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				error={!!error}
				helperText={error}
				sx={{ mb: 2, width: '100%' }}
			/>
			{!report && (
				<TextField
					label="Optional AI Prompt"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Add context or guidance for AI"
					disabled={generating}
					sx={{ mb: 2, width: '100%' }}
				/>
			)}
			<Button
				variant="outlined"
				onClick={handleGenerateDraft}
				disabled={!title || generating}
				sx={{ mb: 2 }}>
				{generating ? <CircularProgress size={20} /> : aiBtnText}
			</Button>

			{generateError && (
				<Typography variant="body2" color="error" sx={{ mb: 2 }}>
					{generateError}
				</Typography>
			)}

			<TextField
				label="Content"
				multiline
				rows={6}
				value={content}
				onChange={(e) => setContent(e.target.value)}
				error={!!error}
				helperText={error}
				sx={{ mb: 2, width: '100%' }}
			/>

			<Button variant="contained" onClick={handleSubmit} sx={{ mr: 1 }}>
				Save
			</Button>
			<Button variant="outlined" onClick={onClose}>
				Cancel
			</Button>
		</Box>
	)
}
