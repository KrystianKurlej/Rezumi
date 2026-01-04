import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Links } from '@/lib/db/types'
import { getLinks } from '@/lib/db'
import type { AppThunk } from '@/lib/store'

const initialState: Links = {
	languageId: null,
	linkedin: '',
	github: '',
	portfolio: '',
	twitter: '',
	facebook: '',
	instagram: '',
	website: '',
}

const linksSlice = createSlice({
	name: 'links',
	initialState,
	reducers: {
		setLinks(state, action: PayloadAction<Links>) {
			return action.payload
		},
		resetLinks: () => initialState,
	},
})

export const { setLinks, resetLinks } = linksSlice.actions

export const loadLinksFromDB = (): AppThunk => async (dispatch, getState) => {
	try {
		const state = getState()
		const selectedLanguage = state.preview.selectedLanguage
		const defaultLanguage = state.settings.defaultLanguage

		const languageId = selectedLanguage === defaultLanguage ? null : selectedLanguage || null

		const savedLinks = await getLinks(languageId)
		const links: Links = {
			languageId,
			linkedin: savedLinks?.linkedin || '',
			github: savedLinks?.github || '',
			portfolio: savedLinks?.portfolio || '',
			twitter: savedLinks?.twitter || '',
			facebook: savedLinks?.facebook || '',
			instagram: savedLinks?.instagram || '',
			website: savedLinks?.website || '',
		}

		dispatch(setLinks(links))
	} catch (error) {
		console.error('Error loading links:', error)
	}
}

export default linksSlice.reducer
