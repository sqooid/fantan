/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	ChapterCommentReactions = "chapterCommentReactions",
	ChapterComments = "chapterComments",
	ChapterVisits = "chapterVisits",
	Chapters = "chapters",
	Novels = "novels",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ChapterCommentReactionsRecord = {
	comment?: RecordIdString
	reaction?: string
	user?: RecordIdString
}

export type ChapterCommentsRecord<Treactions = unknown> = {
	chapter: RecordIdString
	content: string
	reactions?: null | Treactions
	user: RecordIdString
}

export type ChapterVisitsRecord = {
	chapter?: RecordIdString
	idHash?: string
}

export type ChaptersRecord<Tcontent = unknown, Tnotes = unknown> = {
	content: null | Tcontent
	editor?: RecordIdString
	notes?: null | Tnotes
	novel: RecordIdString
	published?: boolean
	source?: string
	title?: string
	value: string
	views?: number
	volume: number
}

export enum NovelsSourceLanguageOptions {
	"中文" = "中文",
	"日本語" = "日本語",
	"Other" = "Other",
}
export type NovelsRecord = {
	chaptersCount?: number
	cover?: string
	description?: string
	editors?: RecordIdString[]
	originalAuthor: string
	originalSource?: string
	owner: RecordIdString
	slug: string
	sourceLanguage: NovelsSourceLanguageOptions
	title: string
	views?: number
}

export type UsersRecord<Thistory = unknown> = {
	avatar?: string
	discordWebhook?: string
	history?: null | Thistory
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ChapterCommentReactionsResponse<Texpand = unknown> = Required<ChapterCommentReactionsRecord> & BaseSystemFields<Texpand>
export type ChapterCommentsResponse<Treactions = unknown, Texpand = unknown> = Required<ChapterCommentsRecord<Treactions>> & BaseSystemFields<Texpand>
export type ChapterVisitsResponse<Texpand = unknown> = Required<ChapterVisitsRecord> & BaseSystemFields<Texpand>
export type ChaptersResponse<Tcontent = unknown, Tnotes = unknown, Texpand = unknown> = Required<ChaptersRecord<Tcontent, Tnotes>> & BaseSystemFields<Texpand>
export type NovelsResponse<Texpand = unknown> = Required<NovelsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Thistory = unknown, Texpand = unknown> = Required<UsersRecord<Thistory>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	chapterCommentReactions: ChapterCommentReactionsRecord
	chapterComments: ChapterCommentsRecord
	chapterVisits: ChapterVisitsRecord
	chapters: ChaptersRecord
	novels: NovelsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	chapterCommentReactions: ChapterCommentReactionsResponse
	chapterComments: ChapterCommentsResponse
	chapterVisits: ChapterVisitsResponse
	chapters: ChaptersResponse
	novels: NovelsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'chapterCommentReactions'): RecordService<ChapterCommentReactionsResponse>
	collection(idOrName: 'chapterComments'): RecordService<ChapterCommentsResponse>
	collection(idOrName: 'chapterVisits'): RecordService<ChapterVisitsResponse>
	collection(idOrName: 'chapters'): RecordService<ChaptersResponse>
	collection(idOrName: 'novels'): RecordService<NovelsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
