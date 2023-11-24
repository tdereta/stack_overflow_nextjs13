"use client"

import React from 'react'
import Link from "next/link"
import Image from "next/image"
import {usePathname} from "next/navigation"
import RenderTag from "@/components/shared/RenderTag"

const RightSidebar = () => {
    const topQuestions = [
        {
            _id: 1, title: "What is the difference between var and let?"
        },
        {
            _id: 2, title: "What is the difference between var and let?"
        },
        {
            _id: 3, title: "What is the difference between var and let?"
        },
        {
            _id: 4, title: "What is the difference between var and let?"
        },
        {
            _id: 5, title: "What is the difference between var and let?"
        }
    ]

    const popularTags = [
        {
            _id: '1', name: "NextJS", number: 21
        },
        {
            _id: '2', name: "Test", number: 15
        },
        {
            _id: '3', name: "React", number: 13
        },
        {
            _id: '4', name: "CSS", number: 10
        },
        {
            _id: '5', name: "Next JS", number: 8
        },
    ]
        const pathname = usePathname()
        return (
            <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0
        flex h-screen flex-col justify-between overflow-y-auto p-6 pt-36
        shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
                <div className="flex flex-1 flex-col gap-2">
                    <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                    <div className="mt-7 flex flex-col w-full gap-3">
                        {topQuestions.map((question) => (
                            <Link href={`questions/${question._id}`}
                                  key={question._id}
                                  className="flex cursor-pointer items-center justify-between gap-7">
                                <p className="body-medium text-dark500_light700">{question.title}</p>
                                <Image src="/assets/icons/chevron-right.svg"
                                       alt="Arrow Right"
                                       width={20}
                                       height={20}
                                       className="invert-colors"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mt-16">
                    <h3 className="h3-bold text-dark200_light900 mt-10">Popular Tags</h3>
                    <div className="mt-7 flex flex-col gap-3">
                        {popularTags.map((tag) => (
                            <RenderTag
                                key={tag._id}
                                _id={tag._id}
                                name={tag.name}
                                number={tag.number}
                                showCount
                            />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

export default RightSidebar