import React from 'react'
import LocalSearch from "@/components/shared/search/LocalSearch"
import Filter from "@/components/shared/Filter"
import {QuestionFilters} from "@/constants/filters"
import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import {getSavedQuestions} from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs"

export default async function Page() {
    const { userId } = auth()
    if(!userId) {
        return null
    }
    const result = await getSavedQuestions({
        clerkId: userId,
    })

    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search amazing minds here..."
                    otherClasses="flex-1"
                />
                <Filter
                    filters={QuestionFilters}
                    otherClasses="min-h-[30px] sm:min-w-[170px]"
                    containerClasses="hidden max-lg:flex"
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
                        title="There's no saved questions to show"
                        description="Be the first to break the silence! Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question/"
                        linkTitle="Ask a Question"
                    />
                }
            </div>
        </>
    )
}

