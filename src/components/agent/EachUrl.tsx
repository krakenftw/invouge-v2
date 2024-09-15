import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

function EachUrl({
  url,
  index,
  handleDeleteURL
}: {
  url: string;
  index: number;
  handleDeleteURL: (index: number) => void;
}) {
  const [text, setText] = useState(url);
  return (
    <div className='flex w-full items-center justify-between overflow-y-hidden overflow-x-scroll h-12 '>
      <Input
        className='p-6 m-0 border border-border'
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <Button
        onClick={() => handleDeleteURL(index)}
        className='hover:bg-transparent'
        variant='ghost'
      >
        <Cross2Icon />
      </Button>
    </div>
  );
}

export default EachUrl;
