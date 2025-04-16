import axios from 'axios'

const apiUrl = import.meta.env.VITE_OPENAI_API_URL
const apiKey = import.meta.env.VITE_OPENAI_API_KEY

console.log({ apiKey, apiUrl })

export const openai = axios.create({
	baseURL: apiUrl,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
})
