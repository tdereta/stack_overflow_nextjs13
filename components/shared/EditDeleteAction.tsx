"use client"

import React from 'react'
import Image from 'next/image'
import {deleteQuestion} from "@/lib/actions/question.action"
import {usePathname, useRouter} from "next/navigation"
import {deleteAnswer} from "@/lib/actions/answer.action";

interface Props {
    type: string
    ItemId: string
}

const EditDeleteAction = ({ type, ItemId }: Props) => {
    const pathname = usePathname()
    const router = useRouter()

    const handleEdit = () => {
        router.push(`/question/edit/${JSON.parse(ItemId)}`)
    }

    const handleDelete = async () => {
        if(type === 'Question') {
            await deleteQuestion({
                questionId: JSON.parse(ItemId),
                path: pathname
            })
        } else if(type === 'Answer') {
            await deleteAnswer({
                answerId: JSON.parse(ItemId),
                path: pathname
            })
        }
    }

    return (
        <div className="flex item-center justify-end gap-3 max-sm:w-full">
            {type === 'Question' && (
                <Image
                    src="/assets/icons/edit.svg"
                    alt="Edit"
                    width={14}
                    height={14}
                    className="cursor-pointer object-contain"
                    onClick={handleEdit}
                />
            )}
                <Image
                    src="/assets/icons/trash.svg"
                    alt="Delete"
                    width={14}
                    height={14}
                    className="cursor-pointer object-contain"
                    onClick={handleDelete}
                />
        </div>
    )
}

export default EditDeleteAction
