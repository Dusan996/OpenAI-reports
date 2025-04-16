export const USER_ROLES = Object.freeze({
	ADMIN: 'admin' as const,
	USER: 'user' as const,
})

export type Role = (typeof USER_ROLES)[keyof typeof USER_ROLES]
