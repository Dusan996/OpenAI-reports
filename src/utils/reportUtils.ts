import { Report } from '../types/report'

export const getReportsFromStorage = (): Report[] => {
	const reports = localStorage.getItem('reports')
	return reports
		? JSON.parse(reports).map((report: any) => ({
				...report,
				createdAt: new Date(report.createdAt),
				updatedAt: new Date(report.updatedAt),
		  }))
		: []
}

export const saveReportToStorage = (reports: Report[]): void => {
	localStorage.setItem('reports', JSON.stringify(reports))
}

export const createReport = (title: string, content: string): Report => {
	if (!title || !content) {
		throw new Error('Title and content are required')
	}
	const now = new Date()
	return {
		id: Date.now().toString(),
		title,
		content,
		createdAt: now,
		updatedAt: now,
	}
}

export const updateReport = (
	report: Report,
	title: string,
	content: string,
): Report => {
	if (!title || !content) {
		throw new Error('Title and content are required')
	}
	return {
		...report,
		title,
		content,
		updatedAt: new Date(),
	}
}
