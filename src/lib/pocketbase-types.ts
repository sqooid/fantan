/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
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

export type ChaptersRecord = {
	content?: string
	novel: RecordIdString
	published?: boolean
	title?: string
	value: string
}

export type NovelsRecord = {
	description?: string
	editors?: RecordIdString[]
	owner: RecordIdString
	title: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ChaptersResponse<Texpand = unknown> = Required<ChaptersRecord> & BaseSystemFields<Texpand>
export type NovelsResponse<Texpand = unknown> = Required<NovelsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	chapters: ChaptersRecord
	novels: NovelsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	chapters: ChaptersResponse
	novels: NovelsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'chapters'): RecordService<ChaptersResponse>
	collection(idOrName: 'novels'): RecordService<NovelsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
