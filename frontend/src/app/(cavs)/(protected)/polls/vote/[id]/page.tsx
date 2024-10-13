import React from 'react'
import { Metadata } from 'next';
import VotePoll from './VotePoll';

export const metadata: Metadata = {
    title: 'Vote Poll',
};

export default function VotePage({ params: { id: poll_id } }: { params: { id: string } }) {
    return (
        <VotePoll 
            poll_id={poll_id}
        />
    )
}
