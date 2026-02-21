import Post from "../components/Post";

import { useEffect, useState } from "react";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8800/posts").then(res => {
            res.json().then(data => {
                setPosts(data);
            });
        })
    }, []);

    return <div>
        {posts.map(post => {
            return <Post key={post.id} post={post} />
        })}
    </div>;
}