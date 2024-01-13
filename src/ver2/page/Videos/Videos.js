import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Videos.css";

import Paginations from "../../components/Paginations";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import filterApp from "../../components/image/filter-app.png";
import Header from "../../components/Header/Header";
import { VideoItem } from "../../components/VideoItem/VideoItem";

const Videos = () => {
  const [category, setCategory] = useState(0);
  const [listVideo, setListVideo] = useState([]);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(listVideo.length / 20);

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const categories = [];
    Promise.all([
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=1`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=2`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=3`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=4`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=5`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=6`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=7`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=8`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=9`),
      axios.get(`https://metatechvn.store/lovehistory/listvideo/1?category=10`),
    ]).then((values) => {
      values.map(({ data }) => {
        const category = {
          value: data.list_sukien_video[0].id_categories,
          name: data.list_sukien_video[0].name_categories,
          id: data.list_sukien_video[0].id,
        };

        return categories.push(category);
      });
      setCategoryList(categories);
    });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://metatechvn.store/lovehistory/listvideo/1?category=${category}`
      )
      .then((response) => {
        const errorMessage = "exceed the number of pages!!!";

        if (response.data === errorMessage) {
          // Nếu response.data trùng với chuỗi thông báo, hiển thị alert
          toast.error(errorMessage);
        } else {
          // Nếu không trùng, cập nhật state như bình thường
          setListVideo(response.data.list_sukien_video);
          // console.log("list video", response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [category]);

  const handleChangeCategory = (e) => {
    setPage(1);
    setCategory(Number.parseInt(e.target.value));
  };

  return (
    <>
      <Header
        data={{
          title: "videos",
          myCollection: "videos/my-videos",
          download: true,
        }}
      />
      <div className="max-h-[100vh] overflow-y-scroll rounded-lg py-4">
        <div className="flex flex-col gap-8">
          <div class="flex justify-between items-center rounded-lg">
            <div className="flex items-center rounded-lg bg-green-500 overflow-hidden text-white text-4xl px-3">
              <div>
                <img src={filterApp} alt="Filter" />
              </div>

              <Select
                sx={{
                  width: "100%",
                  fontSize: { xs: 16, md: 18 },
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": { borderStyle: "none" },
                  ".MuiSelect-icon": {
                    color: "white",
                    fontSize: { xs: 16, md: 18 },
                  },
                }}
                value={category}
                onChange={handleChangeCategory}
              >
                <MenuItem value={0}>Category</MenuItem>
                {categoryList.map(({ id, name, value }) => (
                  <MenuItem key={id} value={value}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-white text-2xl sm:text-4xl font-semibold">
                Page:
              </span>
              <Paginations
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px]">
            {listVideo &&
              listVideo
                .slice(20 * (page - 1), 20 * page)
                .map((video) => (
                  <VideoItem {...video} type="video goc" key={video.id} />
                ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Videos;
