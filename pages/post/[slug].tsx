import Header from '../../components/Header'
import Head from 'next/head'
import PortableText from 'react-portable-text'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../types'
import { GetStaticProps } from 'next'
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react'

type Props = {
    post: Post
}

type FormInputs = {
    _id: string,
    name: string,
    email: string,
    comment: string
};

const PostPage = ({ post }: Props) => {

    const [submitted, setSubmitted] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        await fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            console.log(data)
            setSubmitted(true)
        }).catch(err => {
            console.log(err)
            setSubmitted(false)
        })
    }

    return (

        <main>
            <Head>
                <title>{post.title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <img src={urlFor(post.mainImage).url()!} className="h-40 object-cover w-full" />

            <article className='max-w-3xl mx-auto p-5'>
                <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
                <h2 className='text-xl font-light mb-2'>{post.description}</h2>

                <div className='flex items-center space-x-2'>
                    <p className='font-light tex-sm'>Blog post by {post.author.name} - Published at {new Date(post._createdAt).toLocaleDateString()}</p>
                    <img className='h-10 w-10 rounded-full' src={urlFor(post.author.image).url()!} />
                </div>

                <div className='mt-10'>
                    <PortableText
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        serializers={
                            {
                                h1: (props: any) => {
                                    <h1 className='text-2xl font-bold my-5' {...props} />
                                },
                                h2: (props: any) => {
                                    <h1 className='text-xl font-bold my-5' {...props} />
                                },
                                li: ({ children }: any) => {
                                    <li className='list-disc ml-4'>{children}</li>
                                },
                                link: ({ children, href }: any) => {
                                    <a href={href} className='hover:underline text-gray-500'>{children}</a>
                                },
                            }
                        }
                    />
                </div>

            </article>

            <hr className='mx-w-lg my-5 mx-auto border border-black' />

            {submitted ? (
                <div className='flex flex-col my-10 py-10 max-w-3xl mx-auto text-center space-y-5 bg-black text-white'>
                    <h1 className='text-5xl font-bold'>Thank you for submitting</h1>
                    <p className='text-2xl font-light'>Once been approved, it will appear later</p>
                </div>

            ) : (
                <form className='flex flex-col p-5 max-w-2xl mx-auto mb-10' onSubmit={handleSubmit(onSubmit)}>

                    <h4 className='text-3xl font-bold'>Leave a comment</h4>

                    <input {...register("_id")} className="" type="hidden" name="_id" value={post._id} />

                    <label className='block mb-5'>
                        <span className='text-gray-700'>Name</span>
                        <input {...register("name", { required: true })} className='shadow border rounded py-2 px-3 form-input block mt-1 w-full ring-gray-400 focus:ring' placeholder='John' type='text' />
                    </label>

                    <label className='block mb-5'>
                        <span className='text-gray-700'>Email</span>
                        <input {...register("email", { required: true })} className='shadow border rounded py-2 px-3 form-input block mt-1 w-full ring-gray-400 focus:ring' placeholder='example@gmail.com' type='email' />
                    </label>

                    <label className='block mb-5'>
                        <span className='text-gray-700'>Comment</span>
                        <textarea {...register("comment", { required: true })} placeholder='your comment' rows={8} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-gray-400 focus:ring" />
                    </label>

                    <div className='flex flex-col p-5'>
                        {errors.name && (<span className='text-red-500'>The name filed is required</span>)}
                        {errors.comment && (<span className='text-red-500'>The comment filed is required</span>)}
                        {errors.email && (<span className='text-red-500'>The email filed is required</span>)}
                    </div>

                    <input type="submit" className="shadow bg-black px-4 py-2 rounded-full cursor-pointer hover:bg-gray-300 text-white font-bold" />

                </form>
            )}

            <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-gray-400 space-y-5 rounded-lg'>
                <h3 className='text-4xl'>Comments</h3>
                <hr className='pb-2' />
                {post.comments.map(comment => (
                    <div key={comment._id}>
                        <p>
                            <span className='font-bold'>{comment.name}:</span>{comment.comment}
                        </p>
                    </div>
                ))}
            </div>

        </main>
    )
}

export default PostPage

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
    _id,
    slug{
        current
    }
}`

    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  title,
  author-> {
    name,
    image
},
"comments": *[
    _type == "comment" &&
    post._ref == ^._id &&
    approved == true],
description,
mainImage,
slug,
body
}`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    })

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        }
    }
}