"use client"

import React, {useEffect} from 'react'
import Image from 'next/image'
import {formatAndDivideNumber} from "@/lib/utils"
import { upVoteQuestion, downVoteQuestion } from "@/lib/actions/question.action"
import { upVoteAnswer, downVoteAnswer } from "@/lib/actions/answer.action"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import {toggleSaveQuestion} from "@/lib/actions/user.action";
import {viewQuestion} from "@/lib/actions/interaction.action";

interface Props {
    type: string
    itemId: string
    userId: string
    upVotes: number
    downVotes: number
    hasUpVoted: boolean
    hasDownVoted: boolean
    hasSaved?: boolean
}

const Votes = ({ type, itemId, userId, upVotes, downVotes, hasUpVoted, hasDownVoted, hasSaved }: Props) => {
    const pathname = usePathname();

    const router = useRouter()

    const handleSave = async () => {
        await toggleSaveQuestion({
            userId: JSON.parse(userId),
            questionId: JSON.parse(itemId),
            path: pathname
        })
    }
    const handleVote = async (action: string) => {
        if(!userId) {
            return
        }

        if(action === 'upvote') {
            if (type === 'question') {
                await upVoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpVoted,
                    hasDownVoted,
                    path: pathname,
                })
            } else if(type === 'answer') {
                await upVoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpVoted,
                    hasDownVoted,
                    path: pathname,
                })
            }
            return
        }

        if(action === 'downvote') {
            if (type === 'question') {
                await downVoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpVoted,
                    hasDownVoted,
                    path: pathname,
                })
            } else if(type === 'answer') {
                await downVoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpVoted,
                    hasDownVoted,
                    path: pathname,
                })
            }
            return
        }
    }

    useEffect(() => {
        viewQuestion({
            questionId: JSON.parse(itemId),
            userId: userId ? JSON.parse(userId) : undefined,
        })
    }, [itemId, userId, pathname, router]);


    return (
        <div className="flex gap-5">
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                    <Image
                        src={hasUpVoted ? '/assets/icons/upvoted.svg' : '/assets/icons/upvote.svg'}
                        width={18}
                        height={18}
                        alt="upvote"
                        className="cursor-pointer"
                        onClick={() => handleVote('upvote')}
                    />
                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatAndDivideNumber(upVotes)}
                        </p>
                    </div>
                </div>
                <div className="flex-center gap-1.5">
                    <Image
                        src={hasDownVoted ? '/assets/icons/downvoted.svg' : '/assets/icons/downvote.svg'}
                        width={18}
                        height={18}
                        alt="downvote"
                        className="cursor-pointer"
                        onClick={() => handleVote('downvote')}
                    />
                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatAndDivideNumber(downVotes)}
                        </p>
                    </div>
                </div>
            </div>
            {type === 'question' && (
                <Image
                    src={hasSaved ? '/assets/icons/star-filled.svg' : '/assets/icons/star-red.svg'}
                    width={18}
                    height={18}
                    alt="star"
                    className="cursor-pointer"
                    onClick={handleSave}
                />
            )}
        </div>
    )
}

export default Votes