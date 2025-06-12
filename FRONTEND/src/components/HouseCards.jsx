import React from "react";
import CarouselImage from "./CarouselImage";
import ListText from "./ListText";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBookDead,
  FaBookOpen,
  FaDumpster,
  FaTicketAlt,
} from "react-icons/fa";

const HouseCards = ({ data, posts, apiBaseUrl, userInfo, shortlist }) => {
  const navigate = useNavigate();

  const f = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "KSH",
  });

  const handleTaken = async (id) => {
    try {
      const res = await fetch(`${apiBaseUrl}/verify?id=${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
      });

      const data = await res.json();
      console.log(data);
      navigate(-1);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <>
      {data?.pages.map((group, i) => (
        <div key={i} className="ml-3 mr-3">
          {group?.data?.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10"
              // onClick={() => navigate(`house/${item._id}`)}
            >
              <section className="">
                <CarouselImage item={item} />
              </section>
              <section className="flex justify-between mt-4">
                <section>
                  <ListText content={item?.area}></ListText>
                  <ListText content={f.format(item?.pricing)}></ListText>
                  <ListText content={item?.numOfHouses}>
                    <span className="font-semibold text-gray-400">
                      Rooms available:{" "}
                    </span>{" "}
                  </ListText>
                </section>
                <p
                  className={`flex items-center h-fit pt-1.5 pb-1.5 pr-4 pl-4 text-center rounded-2xl  ${
                    item?.status === "possibly_taken"
                      ? "bg-yellow-400/50"
                      : item?.status === "taken"
                      ? "bg-red-700/50"
                      : "bg-green-600/50"
                  }`}
                >
                  {item?.status}
                </p>
                {/* <section className="flex justify-between m-3"> */}
              </section>
              {posts && (
                <div className="flex flex-col items-end gap-2  m-1 mt-2">
                  <div
                    // onClick set status to vacant
                    className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                  >
                    <FaTicketAlt />
                    <Link to={`/verify-vacancy/${item?._id}`}>
                      Verify vacancy
                    </Link>
                  </div>
                  <div
                    // onClick set status to vacant
                    className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                  >
                    <FaBookOpen />
                    <Link to={``}>Update details</Link>
                  </div>

                  <div className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800">
                    <FaBookDead />
                    <div onClick={() => handleTaken(item._id)}>Delete post</div>
                  </div>
                </div>
              )}
              {shortlist && (
                <div className="flex items-center gap-3 p-2 justify-end">
                  <FaDumpster />
                  <p>Remove</p>
                </div>
              )}

              {/* make it so a landlord is the only gay who can delete his house, and make it not in the istings, make that in the personal info of a landlord */}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default HouseCards;
