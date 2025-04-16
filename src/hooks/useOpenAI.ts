import { useState } from 'react'

import { openai } from '../api/openai'

interface UseOpenAIProps {
	endpoint: string
	data: any
}

interface UseOpenAIResponse {
	loading: boolean
	error: string | null
	data: any
	callAPI: () => void
}

export const useOpenAI = ({
	endpoint,
	data,
}: UseOpenAIProps): UseOpenAIResponse => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [responseData, setResponseData] = useState<any>(null)

	const callAPI = async () => {
		setLoading(true)
		setError(null)
		try {
			const response = await openai.post(endpoint, data)
			setResponseData(response.data)
		} catch (err: any) {
			setError(err.message || 'Failed to fetch data')
		} finally {
			setLoading(false)
		}
	}

	return { loading, error, data: responseData, callAPI }
}
