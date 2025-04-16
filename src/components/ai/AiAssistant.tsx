import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'
import { useOpenAI } from '../../hooks/useOpenAI'

export const AiAssistant: React.FC = () => {
	const [prompt, setPrompt] = useState('')
	const [draft, setDraft] = useState('')
	const [summary, setSummary] = useState('')

	const {
		loading: generating,
		error: generateError,
		callAPI: generateDraft,
	} = useOpenAI({
		endpoint: '/chat/completions',
		data: {
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 150,
		},
	})

	const {
		loading: summarizing,
		error: summarizeError,
		callAPI: summarizeContent,
	} = useOpenAI({
		endpoint: '/completions',
		data: {
			model: 'text-davinci-003',
			prompt: `Summarize the following text: ${draft}`,
			max_tokens: 50,
		},
	})

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h4" gutterBottom>
				AI Assistant
			</Typography>
			<TextField
				label="Prompt"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				sx={{ mb: 2, width: '100%' }}
			/>
			<Button
				variant="contained"
				onClick={generateDraft}
				disabled={generating}
				sx={{ mr: 1 }}>
				Generate Draft
			</Button>
			<Button
				variant="contained"
				onClick={summarizeContent}
				disabled={summarizing}>
				Summarize Content
			</Button>
			{generating && <Typography variant="body1">Generating...</Typography>}
			{summarizing && <Typography variant="body1">Summarizing...</Typography>}
			{generateError && <Alert severity="error">{generateError}</Alert>}
			{summarizeError && <Alert severity="error">{summarizeError}</Alert>}
			{draft && (
				<Typography variant="body1" sx={{ mt: 2 }}>
					Draft: {draft}
				</Typography>
			)}
			{summary && (
				<Typography variant="body1" sx={{ mt: 2 }}>
					Summary: {summary}
				</Typography>
			)}
		</Box>
	)
}
