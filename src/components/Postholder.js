'use client';
import React, { useState, useEffect, useRef } from 'react'
import Post from './Post';

const Cards = ({ data, loadMore }) => {
  const cardsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading && entry.target === cardsRef.current[6]) {
          setIsLoading(true);
          loadMore();
        }

        // Handle animations for when cards come into view
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          entry.target.classList.remove('animate-hidden', 'animate-blur');
        } else {
          entry.target.classList.add('animate-blur');
          entry.target.classList.remove('animate-visible');
        }
      });
    }, { threshold: 0.5 });

    cardsRef.current.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, [isLoading, loadMore]);

  return (
    <div>
      {data.map((post, index) => (
        <div
          key={index}
          ref={(el) => (cardsRef.current[index] = el)}
          className="card animate-hidden"
        >
          <Post post={post} />
        </div>
      ))}
      {isLoading && <div className='text-3xl font-bold'>Loading...</div>}
    </div>
  );
};

const Postholder = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch the posts on initial load and when the page changes
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${currentPage}&_limit=10`);
      const data = await response.json();
      setPosts((prevPosts) => [...prevPosts, ...data]);
    };

    fetchPosts();
  }, [currentPage]);

  // Function to load more posts when the 7th post becomes visible
  const loadMorePosts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <Cards data={posts} loadMore={loadMorePosts} />
    </div>
  );
};

export default Postholder;
