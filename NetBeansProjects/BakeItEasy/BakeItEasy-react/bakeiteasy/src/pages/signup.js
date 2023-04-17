import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const type = new URLSearchParams(useLocation().search).get("type");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      toast.loading("loading, please wait!");

      const fileType = file.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "module-buddies");
        data.append("cloud_name", "nelsonchoo456");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/nelsonchoo456/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        toast.dismiss();

        if (response.ok) {
          const responseData = await response.json();
          console.log("CLOUD URL", responseData.url);
          setProfilePic(responseData.url);
          setImagePath(responseData.url);
        } else {
          setProfilePic(null);
          const errorData = await response.json();
          toast.error(errorData.error);
        }
      } else {
        toast.dismiss();
        toast.error("Invalid picture format. Please try again.");
        setProfilePic(null);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      name,
      username,
      email,
      password,
      phoneNo,
      imagePath,
    };

    if (type === "buyer") {
      requestBody.address = address;
    }

    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/${
        type === "seller" ? "sellers" : "buyers"
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      const user = await response.json();
      if (type === "seller") {
        localStorage.setItem("seller", JSON.stringify(user));
        console.log("seller set: ", user);
        navigate(`/sellerProfile`);
      } else {
        localStorage.setItem("buyer", JSON.stringify(user));
        console.log("buyer set: ", user);
        navigate(`/`);
      }
    } else {
      // show error message
      const errorData = await response.json();
      console.log(errorData.error);
      toast.error(errorData.error);
    }
  };

  return (
    <Box
      maxW="xl"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      h="xl"
      marginTop="10%"
    >
      <ToastContainer />
      <Box align="center">
        <img
          width="50px"
          height="50px"
          hspace="30px"
          src={require("../assets/bakeiteasy-logo.png")}
          alt="BakeItEasy"
        ></img>
        <div className="logo">BakeItEasy</div>
      </Box>

      <form onSubmit={handleSubmit}>
        <FormControl mt={4} variant="floating">
          <Input
            type="text"
            placeholder=" "
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={64}
          />
          <FormLabel>Name</FormLabel>
        </FormControl>
        <FormControl mt={4} variant="floating">
          <Input
            type="text"
            placeholder=" "
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            maxLength={16}
          />
          <FormLabel>Username</FormLabel>
        </FormControl>

        <FormControl mt={4} variant="floating">
          <Input
            type="email"
            placeholder=" "
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={128}
          />
          <FormLabel>Email address</FormLabel>
        </FormControl>
        <FormControl mt={4} variant="floating">
          <Input
            type="password"
            placeholder=" "
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            maxLength={64}
          />
          <FormLabel>Password</FormLabel>
        </FormControl>
        <FormControl mt={4} variant="floating">
          <Input
            type="tel"
            placeholder=" "
            value={phoneNo}
            onChange={(event) => setPhoneNo(event.target.value)}
            required
            maxLength={128}
          />
          <FormLabel>Phone Number</FormLabel>
        </FormControl>
        {type === "buyer" && (
          <FormControl mt={4} variant="floating">
            <Input
              type="text"
              placeholder=" "
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              maxLength={256}
            />
            <FormLabel>Address</FormLabel>
          </FormControl>
        )}

        <FormLabel mt={6}>Profile picture</FormLabel>
        <Input
          type="file"
          placeholder=" "
          onChange={handleImageChange}
          accept="image/jpeg, image/png"
        />
        {profilePic && <Image src={profilePic} />}

        <Box mt={4} display="flex" alignItems="center">
          <Button bg="#E2725B" colorScheme="white" type="submit" w="100%">
            Register
          </Button>
        </Box>

        <Box mt={4} display="flex" alignItems="center">
          <Link
            to={`/forgotPassword?type=${type}`}
            style={{ color: "#E2725B", textDecoration: "underline" }}
          >
            Forgot password?
          </Link>
        </Box>

        <Box
          maxW="xl"
          mx="auto"
          mt={20}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text marginRight="2">Have an account?</Text>
          <Link
            to={`/login?type=${type}`}
            style={{ color: "#E2725B", textDecoration: "underline" }}
          >
            Sign in here!
          </Link>
        </Box>
      </form>
    </Box>
  );
}

export default Signup;
