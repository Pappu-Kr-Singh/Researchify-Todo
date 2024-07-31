import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import WelcomeMessage from "./WelcomeMessage";

import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [fetching, setFetching] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postImg, setPostImg] = useState([]);
  const [post, setPost] = useState({ title: "", description: "" });

  // console.log(currentUser.data.user._id);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/todos/${currentUser.data.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.data.accessToken}`, // Use access token
            },
          }
        );

        const jsonData = response.data.data;
        // console.log(jsonData);
        setPosts(jsonData);
        setFetching(false);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/todos/${postId}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.data.accessToken}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <main id="profile">
        <div className="card">
          <center>
            <div className="profileimage">
              <img
                className="profile__img"
                src={currentUser.data.user.avatar}
                alt=""
              />
            </div>
            <div className="Name text-black">
              <p>{currentUser.data.user.userName}</p>
            </div>
            <span className="text-black">
              id:
              <p className="text-secondary">{currentUser.data.user._id}</p>
            </span>
          </center>
        </div>
      </main>

      <hr />

      <h1 className="text-center text-black">Your Todo</h1>
      <div className="your__post">
        {/* {!fetching && posts.length === 0 && <WelcomeMessage />} */}
        {fetching ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => (
            <div
              className="card post-card"
              style={{ width: "20rem", margin: "2rem 0rem" }}
              key={post._id}
            >
              <div className="card-body ">
                <h5 className="card-title text-white bg-transparent ">
                  {post.todoName}
                </h5>
                <p className="card-text text-white bg-transparent ">
                  {post.date}
                </p>

                <div className="deleteNupdata_btn bg-transparent">
                  <button
                    className="btn-danger text-white bg-danger rounded"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && (
        <form onSubmit={handleUpdateSubmit} className="update-form">
          <h3>Update Post</h3>
          <div className="form-group">
            <label htmlFor="postId">Post Id</label>
            <input
              type="text"
              id="postId"
              value={post._id}
              onChange={(e) => setPost({ ...post, postId: e.target.value })}
              defaultValue={selectedPost._id}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={post.description}
              onChange={(e) =>
                setPost({ ...post, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="postImg">Image</label>
            <input
              type="file"
              id="postImg"
              onChange={(e) => setPostImg(e.target.files[0])}
            />
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={() => setSelectedPost(null)}>
            Cancel
          </button>
        </form>
      )}
    </>
  );
};

export default Profile;
