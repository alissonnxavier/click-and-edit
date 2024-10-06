'use client';


import { FormInput } from "@/components/form-input";
import UserButton from "./features/auth/components/user-button";
import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";


export default function Home() {

  const [title, setTitle] = useState("data title");
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string

    if (title === title) {
      return disableEditing();
    }

    setTitle(title);
  }

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);



  return (
    <div className="flex items-center justify-start h-full w-full bg-[#f1f2f4] rounded-md shadow-none pb-2 ">
      {isEditing ? (
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex justify-center items-center"
        >
          <input hidden id="id" name="id" />
          <input hidden id="boardId" name="boardId" />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id='title'
            placeholder="Enter list title..."
            defaultValue="first title"
            className="ml-auto text-sm px-[7px] py-1 h-7 font-medium border-transparent focus:border-input transition truncate bg-transparent focus:bg-white shadow-none cursor-pointer"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="text-green-500 text-sm px-2.5 py-1 h-7 font-medium border-transparent cursor-pointer"
        >
          {title}
        </div>
      )}
      <UserButton />
    </div>
  );
}
