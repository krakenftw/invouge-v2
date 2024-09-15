import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import EachUrl from "./EachUrl";

function UrlPicker({
  urls,
  handleCreateBot,
  loading,
  setWebsiteName,
  websiteName,
  handleDeleteURL
}: {
  urls: string[];
  handleCreateBot: () => void;
  loading: boolean;
  setWebsiteName: (name: string) => void;
  websiteName: string;
  handleDeleteURL: (index: number) => void;
}) {
  return (
    <div className='flex flex-col gap-2 w-2/3'>
      <Separator className='my-4' />
      <h1 className='text-xl ml-2 font-bold'>
        We found the following follow-up links 👇🏻
      </h1>
      {urls.slice(0, 5).map((each: string, index) => (
        <div key={index} className='flex flex-col gap-2'>
          <EachUrl
            url={each}
            index={index}
            handleDeleteURL={handleDeleteURL}
          />
        </div>
      ))}
      <Separator className='my-2' />
      <div className='my-2 flex flex-col gap-2'>
        <Label className='text-xl ml-2'>Website Name</Label>
        <Input
          className='p-6 m-0'
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          placeholder='Website Name'
        />
      </div>

      <Button
        disabled={loading}
        variant={"secondary"}
        className='w-full py-6'
        onClick={handleCreateBot}
      >
        Create
      </Button>
    </div>
  );
}
export default UrlPicker;
