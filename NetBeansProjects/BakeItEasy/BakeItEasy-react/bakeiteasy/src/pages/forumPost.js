import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaComment, FaRegEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { NavigationBar } from "../components/buyerNavigationBar";
import Comment from "../components/comment";
import { formatDate } from "../components/formatter";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import "./resources/sellerViewFollowers.css";

/*const orderResponse = await fetch(``)*/

function ForumPost() {
  const [comments, setComments] = useState([]);
  const [buyerId, setBuyerId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [post, setPost] = useState(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [currentType, setCurrentType] = useState("");
  const [poster, setPoster] = useState(null);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [posterType, setPosterType] = useState("");
  const [deleteFailed, setDeleteFailed] = useState(false);

  let navigate = useNavigate();

  /* const routeChangeToSellerProfile = () => {
    let path = "/sellerProfile";
    navigate(path);
  }; */

  const routeChangeToForum = () => {
    let path = "/forum";
    navigate(path);
  };

  const { id } = useParams();
  console.log("post param id ", id);

  const [buyerNewComment, setBuyerNewComment] = useState({
    title: "",
    isBuyer: true,
    //buyerId: 0,
    //pId: parseInt(id),
  });
  const [sellerNewComment, setSellerNewComment] = useState({
    title: "",
    isBuyer: false,
    //sellerId: 0,
    //pId: parseInt(id),
  });

  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      const fetchedBuyer = localStorage.getItem("buyer");

      if (!fetchedBuyer && !fetchedSeller) {
        console.log("navbar", "no buyer or seller");
        navigate("/login");
      }
      if (!fetchedSeller) {
        console.log("forum", "is buyer");
        setCurrentType("buyer");
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          console.log("parsedUser.id: ", parsedUser.buyerId);
          setBuyerId(parsedUser.buyerId);
          /*setBuyerNewComment(prevState => { //checked
            return {
                ...prevState,
                buyerId: parsedUser.buyerId,
            }
            }); */
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("forum", "is seller");
        setCurrentType("seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
          /*setSellerNewComment(prevState => { //checked
            return {
                ...prevState,
                sellerId: parsedUser.sellerId,
            }
            }); */
          console.log(
            "seller new comment sellerId set to",
            sellerNewComment.sellerId
          );

          console.log(
            "seller id set in comment state is ",
            sellerNewComment.sellerId
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, [navigate, sellerNewComment.sellerId]);

  // fetch post
  useEffect(() => {
    async function fetchPost() {
      try {
        console.log("fetching post");
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/posts/${id}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPost(data);
        if (data.isBuyer) {
          setPosterType("buyer");
        } else {
          setPosterType("seller");
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    }
    fetchPost();
  }, [id]);

  // fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        console.log("fetching comments");
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/posts/${id}/comments`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setComments(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    }
    fetchComments();
  }, [id]);

  // fetch poster
  useEffect(() => {
    async function fetchPoster() {
      try {
        console.log("fetching poster");
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/posts/${id}/${posterType}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPoster(data);
        console.log(data, "poster info");
        if (buyerId && post.isBuyer) {
          if (buyerId === data.buyerId) {
            setIsOwnPost(true);
          }
        }

        if (sellerId && !post.isBuyer) {
          console.log("seller id", sellerId);
          console.log("postisBuyer", post.isBuyer);
          console.log("post seller Id", data.sellerId);
          if (sellerId === data.sellerId) {
            setIsOwnPost(true);
          }
          console.log(isOwnPost);
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    }
    fetchPoster();
  }, [post, buyerId, id, isOwnPost, posterType, sellerId]);

  const handleDeleteClick = () => {
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/posts/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setDeleteFailed(true);
          setTimeout(() => {
            setDeleteFailed(false);
          }, 2000); // 1000 milliseconds = 1 second
        } else {
          console.log("response ok");

          toast.success("Post deleted successfully! Redirecting...");
          setTimeout(() => {
            routeChangeToForum();
          }, 1000); // 1000 milliseconds = 1 second
        }
        return response.json();
      })
      .then((data) => {
        // handle successful update
      })
      .catch((error) => {});
  };

  /*
RETRIEVE POST BY POST ID
async function fetchComments(postId) {
  if (postId) {
    console.log("sellerId", postId);
    try {
      const response = await fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${postId}/followers`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFollowers(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}*/

  /*
useEffect(() => {
    fetchFollowers(postId);
}, [postId]); */

  useEffect(() => {
    console.log("changed SNC!!!!!", sellerNewComment);
    async function createSellerComment() {
      if (sellerNewComment.title !== "") {
        try {
          console.log("creating seller comment");
          console.log("POSTING", sellerNewComment);
          const response = await fetch(
            `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/${id}/comments`,
            {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(sellerNewComment),
            }
          ).then((response) => {
            if (!response.ok) {
              toast.error("response not ok");
            } else {
              toast.success("seller comment created! refreshing...");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          });
        } catch (error) {
          console.error("ERROR FOR CREATE SELLER COMMENT", error);
        }
      }
    }
    createSellerComment();
  }, [sellerNewComment, id, sellerId]);

  useEffect(() => {
    console.log("changed BNC!!!!!", buyerNewComment);
    async function createBuyerComment() {
      try {
        console.log("creating buyer comment");
  
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/${id}/comments`,
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(buyerNewComment),
          }
        ).then((response) => {
          if (!response.ok) {
            console.log("create buyer comment failed");
          } else {
            toast.success("buyer comment created! refreshing...");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
    createBuyerComment();
  }, [buyerNewComment, id , buyerId]);

  function CommentPopup(props) {
    const [newComment, setNewComment] = useState("");

    const handleCommentChange = (event) => {
      setNewComment(event.target.value);
    };

    const handleSubmitComment = () => {
      // Do something with the comment, e.g. save it to a database
      console.log("saved comment is", newComment);
      if (newComment === "") {
        toast.error("comment cannot be blank!");
      } else if (newComment.length < 1 || newComment.length > 128) {
        toast.error("Your comment must have 1 to 128 characters! Try again.");
      } else {
        if (buyerId) {
          setBuyerNewComment({ ...buyerNewComment, title: newComment });
        } else {
          setSellerNewComment({ ...sellerNewComment, title: newComment });

          console.log("seller ID is", sellerId);
          console.log("!!!!!!!!!!!!!comment set is", sellerNewComment);
        }
        props.onClose();
      }
      // Close the popup
    };

    return (
      <div style={{ marginLeft: 10 }}>
        <textarea
          style={{ color: "black", minWidth: 500 }}
          value={newComment}
          onChange={handleCommentChange}
        />
        <Flex>
          <div className="editPostBtn" onClick={handleSubmitComment}>
            <FaRegEdit style={{ alignSelf: "center" }} />
            <div style={{ width: 5 }}></div>
            <h3>Done</h3>
          </div>
          <div className="editPostBtn" onClick={handleCloseCommentPopup}>
            <h3>Close</h3>
          </div>
        </Flex>
      </div>
    );
  }

  const handleCommentClick = () => {
    setShowCommentPopup(true);
  };

  const handleCloseCommentPopup = () => {
    setShowCommentPopup(false);
  };

  if (!post || !comments) {
    return <div>Loading...</div>;
  }

  function getCategoryUrl(category) {
    switch (category) {
      case "DISCUSSION":
        return "https://cdn-icons-png.flaticon.com/512/8286/8286038.png";
      case "QUESTION":
        return "https://cdn-icons-png.flaticon.com/512/4595/4595213.png";
      case "LOOKINGFOR":
        return "https://cdn-icons-png.flaticon.com/512/3101/3101467.png";
      case "SHARINGINGREDIENTS":
        return "https://cdn-icons-png.flaticon.com/512/3038/3038135.png";
      case "RECIPES":
        return "https://cdn-icons-png.flaticon.com/512/2253/2253457.png";
      default:
        return "";
    }
  }

  console.log("comments", comments);

  return (
    <div>
      {sellerId && <SellerNavigationBar />}
      {buyerId && <NavigationBar />}
      <ToastContainer />

      <div className="dropdownRow">
        <div className="heading"></div>
      </div>
      <div className="searchBarSection">
        <div className="flex">
          <div style={{ width: 500 }}>
            <div style={{ height: 40 }}></div>
            <div className="postDiv">
              <h1 style={{ fontSize: "40px" }}>Post #{post.postId}</h1>
              <h2 style={{ fontSize: "25px" }}>{post.title}</h2>
              <Flex>
                <div style={{ width: 220 }}>
                  <h3>Category: #{post.postCategory}</h3>
                </div>
                <div style={{ width: 70 }}></div>
                <h3>Created: {formatDate(post.dateCreated)}</h3>
              </Flex>
              {poster && (
                <h3>
                  Posted by: {poster.name} ({posterType})
                </h3>
              )}
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  alt="categoryImg"
                  style={{ width: 120 }}
                  src={getCategoryUrl(post.postCategory)}
                />
              </div>
            </div>
            <Flex>
              {isOwnPost && (
                <div
                  className="editPostBtn"
                  onClick={() => navigate("/forum/editPost/" + id)}
                >
                  <FaRegEdit style={{ alignSelf: "center" }} />
                  <div style={{ width: 5 }}></div>
                  <h3>Edit</h3>
                </div>
              )}
              <div className="editPostBtn" onClick={handleCommentClick}>
                <FaComment style={{ alignSelf: "center" }} />
                <div style={{ width: 5 }}></div>
                <h3>Comment</h3>
              </div>
              <div className="editPostBtn" onClick={handleDeleteClick}>
                <MdOutlineCancel />
                <div style={{ width: 5 }}></div>
                <h3>Delete</h3>
              </div>
            </Flex>
            <br />
            {showCommentPopup && <h3>New comment:</h3>}
            {showCommentPopup && (
              <CommentPopup
                style={{ marginRight: 20 }}
                onClose={handleCloseCommentPopup}
              />
            )}
          </div>
          <div className="orderDisplay">
            <div className="forumHeader">Comments</div>
            <br />
            <div style={{ overflow: "auto", height: "650px" }}>
              {comments.map((comment) => (
                <Comment
                  commentId={comment.commentId}
                  currentTitle={comment.title}
                  dateCreated={comment.dateCreated}
                  isBuyer={comment.isBuyer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pfpStyle = {
  padding: 0.5,
  borderRadius: "50%",
  width: 30,
  height: 30,
  objectFit: "cover",
  background: "grey",
  display: "block",
};

const imgStyle = {
  height: 150,
  width: 150,
  objectFit: "cover",
  borderRadius: 10,
};

export default ForumPost;
