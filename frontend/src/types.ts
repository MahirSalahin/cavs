export interface PollType {
    id: string
    title: string
    description: string
    is_private: boolean
    creator_email: string
    created_at: string
    start_time: string
    end_time: string
    roll_ranges: RollRangesType[]
    options: OptionType[]
    selected_option: OptionType | null
    total_votes: number
}

export interface OptionType {
    id: string
    option_text: string
    poll_id: string
}

export interface RollRangesType {
    id: string
    poll_id: string
    start: number
    end: number
}

export interface UserType {
    id: string
    email: string
    full_name: string
    roll: number
    avatar_url: string
}