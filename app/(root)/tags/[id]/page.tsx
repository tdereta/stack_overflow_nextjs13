import React from 'react'
import LocalSearch from "@/components/shared/search/LocalSearch"
import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import { auth } from "@clerk/nextjs"
import {getQuestionsByTagId} from "@/lib/actions/tag.action";
import {IQuestion} from "@/database/question.model";
import {URLProps} from "@/types";


export default async function Page({ params, searchParams }: URLProps) {
    const { userId } = auth()
    if(!userId) {
        return null
    }
    const result = await getQuestionsByTagId({
        tagId: params.id,
        page: 1,
        searchQuery: searchParams.q
    })

    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search tag questions..."
                    otherClasses="flex-1"
                />
            </div>
            <div className="mt-10 flex flex-col w-full gap-6">
                {result.questions.length > 0 ?
                    result.questions.map((card: any) => (
                        <QuestionCard
                            key={card._id}
                            _id={card._id}
                            title={card.title}
                            tags={card.tags}
                            author={card.author}
                            upVotes={card.upVotes}
                            views={card.views}
                            answers={card.answers}
                            createdAt={card.createdAt}
                        />
                    ))
                    : <NoResult
                        title="There's no tags to show"
                        description="Be the first to break the silence! Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question/"
                        linkTitle="Ask a Question"
                    />
                }
            </div>
        </>
    )
}

