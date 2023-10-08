import axios from "axios";
import React, { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/game-context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvitedButton = () => {
  // State
  const [userData, setUserData] = useState({ user: null, friends: [] });
  const [username, setUsername] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { state, dispatch } = useStateContext();

  // Sample user data (replace with your actual data)
  const user = [
    {
      id: 1,
      name: "soufiane",
      login: "smazouz",
      email: "smazouz.gmail.com",
    },
    {
      id: 2,
      name: "said",
      login: "szobi",
      email: "szobi.gmail.com",
    },
    {
      id: 3,
      name: "maikel",
      login: "mike",
      email: "mike.gmail.com",
    },
    {
      id: 4,
      name: "mohemd",
      login: "moha",
      gmail: "moha.gmail.com",
    },
  ];

  // Handle Invite Click
  const handleInviteClick = () => {
    const isUserFound = user.find((user) => user.login === username);

    if (isUserFound) {
      notifySuccess('User invited successfully');
    } else {
      notifyError(`"${username}" not found`);
    }
  };

  // Handle User Click
  const handleUserClick = (clickedUserLogin) => {
    setUsername(clickedUserLogin);
    setFilteredUsers([]); // Clear the filtered users when a user is clicked
  };

  // Handle Input Change
  const handleInputChange = (event) => {
    const enteredUsername = event.target.value;
    setUsername(enteredUsername);

    // Filter users based on the entered username
    const filteredUsers = user.filter((user) =>
      user.login.toLowerCase().includes(enteredUsername.toLowerCase())
    );

    if (enteredUsername === "") {
      setFilteredUsers([]); // Clear the filtered users when the input is empty
    } else {
      setFilteredUsers(filteredUsers);
    }
  };

  // Notify Success
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  // Notify Error
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  // useEffect for fetching user data (replace with your actual fetch)
  useEffect(() => {
    axios
      .get(`http://localhost:5000/game/search?username=${"smazouz"}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.friends);
        setUserData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Render
  return (
    <div className="relative w-[70%] flex mx-auto">
      <input
        type="text"
        placeholder="Enter username"
        className="w-[100%] h-10 rounded-full bg-gray-500 pl-4" // Add padding to the left using pl-2
        value={username}
        onChange={handleInputChange}
        maxLength={22}
      />
      <button
        className="w-[30%] h-10 absolute right-0 rounded-full bg-blue-500 text-white" // Add margin using m-1 and mr-4
        onClick={handleInviteClick}
      >
        Invite
      </button>
      {filteredUsers.length > 0 && (
        <ul className="absolute left-0 mt-10">
          {filteredUsers.map((filteredUser) => (
            <li
              key={filteredUser.id}
              onClick={() => handleUserClick(filteredUser.login)}
              className="cursor-pointer p-2 hover:bg-blue-100"
            >
              {filteredUser.login}
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default InvitedButton;
