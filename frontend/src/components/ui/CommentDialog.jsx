import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setTest] = useState("");
  const ChangeEventHandler = (e) => {
    const inputeText = e.target.value;
    if (inputeText.trim()) {
      setTest(inputeText);
    } else {
      setTest("");
    }
  };

  const sendMessageHandler = async () => {
    alert(text);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/40" />
      <DialogContent
        className="fixed top-1/2 left-1/2 w-full max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-5xl
                   bg-white dark:bg-gray-700 rounded-md shadow-md transform 
                   -translate-x-1/2 -translate-y-1/2 focus:outline-none flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-full md:w-1/2">
            <img
              className="w-full h-full object-cover rounded-t-md md:rounded-l-lg md:rounded-t-none"
              src="https://plus.unsplash.com/premium_photo-1666278379770-440439b08656?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YW5pbWFsc3xlbnwwfHwwfHx8MA%3D%3D"
              alt="image_post"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-between p-4">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage
                      src="https://via.placeholder.com/50"
                      alt="user avatar"
                    />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-lg font-bold">Username</Link>
                  <span className="text-sm">Bio</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-200" />
                </DialogTrigger>
                <DialogPortal>
                  <DialogOverlay className="fixed inset-0 bg-black/40" />
                  <DialogContent
                    className="fixed top-1/2 left-1/2 w-64 p-4 bg-white dark:bg-gray-700 rounded-md shadow-md
                         transform -translate-x-1/2 -translate-y-1/2
                         focus:outline-none space-y-2"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-800 dark:text-gray-100"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-800 dark:text-gray-100"
                    >
                      Add to cart
                    </Button>
                    <Button variant="ghost" className="w-full justify-start ">
                      Delete
                    </Button>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
            {/* Add additional content here */}
            <div className="flex-1 overflow-y-auto max-h-96 p-2">
              cooments ayenge sffFFEFsfsasfsfsaSADD DGSFGHSFFGfgfgg
            </div>
            <div className="p-4">
              <div className="flex item-center gap-1">
                <input
                value={text}
                onChange={ChangeEventHandler}
                  type="text"
                  placeholder="add comment..."
                  className="w-full outline-none border-gray-300 p-2 rounded"
                />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CommentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default CommentDialog;
