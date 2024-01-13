import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import CommentsHistory from "../../components/CommentsHistory/CommentsHistory";
import EventHistory from "../../components/EventHistory/EventHistory";
import "./Home.css";
import Header from "../../components/Header/Header";
import { VideoItem } from "../../components/VideoItem/VideoItem";
import bannerHome from "../../components/image/home-banner.png";

function Home() {
  const userInfo = JSON.parse(window.localStorage.getItem("user-info"));
  const token = userInfo && userInfo.token;

  const [videos, setVideos] = useState([]);
  const [count, setCount] = useState(1);

  useEffect(() => {
    getVideos();
  }, [count, token]);

  const getVideos = async () => {
    const { data, status } = await axios.get(
      `https://metatechvn.store/lovehistory/video/${count}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const errorMessage = "exceed the number of pages!!!";

    if (data === errorMessage) {
      toast.error(errorMessage);
    }

    if (status === 200) {
      setVideos(data.list_sukien_video);
    }
  };

  return (
    <div>
      <Header
        data={{
          background: "#32323280",
          download: true,
        }}
      />

      <div className="home">
        <div className="home-container">
          <div className="home-episodes">
            <div className="home-banner">
              <div className="home-banner-text">
                <h3>salient features</h3>
                <p>AI technology swap faces from your photos and videos.</p>

                <Link to="/create-video">Start Face Swapping</Link>
              </div>

              <div className="home-banner-image">
                <img src={bannerHome} alt="banner home" />
              </div>
            </div>

            <div className="home-episodes-head">
              <h3 className="home-title">episodes for you</h3>
              <Link to="/videos" className="text-3xl">
                Show all
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[10px]">
              {videos &&
                videos
                  .slice(0, 4)
                  .map((video) => (
                    <VideoItem
                      {...video.sukien_video[0]}
                      type="video swap"
                      key={video.sukien_video[0].id_video}
                    />
                  ))}
            </div>
          </div>

          <div className="home-recent">
            <h3 className="home-title">Recent Events</h3>

            <div className="home-recent-main">
              <div className="home-events lg:w-2/3 w-full">
                <EventHistory />
              </div>

              <div className="home-comment lg:w-1/3 w-ful">
                <CommentsHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
