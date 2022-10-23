import Head from 'next/head'
import Header from '../components/Header'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../types'

interface Props {
  posts: [Post]
}

const Home = ({ posts }: Props) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className='flex items-center justify-between bg-yellow-500 border-y border-black py-10 lg:py-0'>
        <div className='space-y-5 px-10'>
          <h1 className='text-6xl max-w-xl font-serif '><span className='underline'>Medium</span> is a place to write, read, and connect</h1>

          <h2>
            It's easy and free to post your thinking on any topic and connect with millions of readers
          </h2>

        </div>
        <img src='https://cdn-icons-png.flaticon.com/512/2582/2582607.png' className='hidden md:inline-flex h-32 lg:h-96' />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map(post => (
          <Link key={post._id} href={`post/${post.slug.current}`}>
            <div className='group cursor-pointer border rounded-lg overflow-hidden'>
              <img className='h-60 object-cover w-full group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} />

              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-sm'>{post.description} by {post.author.name}</p>
                </div>

                <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!} />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
  _id,
  title,
  author->{
  name, 
  image
},
description,
mainImage,
slug
}`;

  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    }
  }
}