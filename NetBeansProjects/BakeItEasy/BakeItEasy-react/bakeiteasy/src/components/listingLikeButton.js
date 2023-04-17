import React, { memo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function ListingLikeButtonNonMemo({ buyerId, lId }) {
  const navigate = useNavigate();
  const [isListingLiked, setIsListingLiked] = useState({});
  const [listingsChecked, setListingsChecked] = useState({});

  const getLikedStatusByLId = async (lId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${buyerId}/${lId}/isListingLiked`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("isListingLiked: ", data);
      console.log("isListingLiked typeof: ", typeof data);
      setIsListingLiked({ ...isListingLiked, [lId]: data });
      setListingsChecked({ ...listingsChecked, [lId]: 1 });

      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }
  };

  // handleListingsToLikes
  const handleListingToLikes = async () => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/${buyerId}/like`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      // redirect to homepage
      console.log("likedListing# ", lId);
      console.log("reported seller!");
      toast.success(`Liked listing #${lId}.`);
      setIsListingLiked({ ...isListingLiked, [lId]: true });
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  // handleRemoveFromLikedListings
  const handleRemoveFromLikedListings = async () => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/${buyerId}/unlike`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      // redirect to homepage
      /*const newListings = listings.filter((obj) => {
        return obj.listingID !== lId;
      });
      setListings(newListings);*/
      console.log("unlikedListing# ", lId);
      toast.success(`Unliked listing #${lId}.`);
      setIsListingLiked({ ...isListingLiked, [lId]: false });
      // success message
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  // return render statements
  if (listingsChecked[lId]) {
    return (
      <>
        {!isListingLiked[lId] && (
          <div className="btn">
            <FiHeart size="1.2rem" onClick={() => handleListingToLikes()} />
          </div>
        )}
        {isListingLiked[lId] && (
          <div className="btn" onClick={() => handleRemoveFromLikedListings()}>
            <img
              className="heartBreakIcon"
              src={require("../assets/heart-broken-icon.png")}
              height="0.8rem"
              width="0.8rem"
              alt="unlike"
            />
          </div>
        )}
      </>
    );
  } else {
    getLikedStatusByLId(lId);
    return <ReactLoading color={"#D3D3D3"} height={"15%"} width={"15%"} />;
  }
}

export const ListingLikeButton = memo(ListingLikeButtonNonMemo);
