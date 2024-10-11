'use client';


import { FormInput } from "@/components/form-input";
import UserButton from "./features/auth/components/user-button";
import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import FormTrigger from "@/components/forms/form-trigger";
import { Button } from "@/components/ui/button";
import { useDrawerPlate } from "@/hooks/use-drawer-plate";
import { Navbar } from "@/components/navbar";


export default function Home() {

  const [title, setTitle] = useState("data title");
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const handleDrawerPlate = useDrawerPlate();

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
    <div className=" h-full gap-5">
      <div className="flex justify-center pt-10">
        <Navbar />
      </div>
      <div className="flex justify-center pt-10">
        <FormTrigger />
      </div>
    </div>
  );
}
