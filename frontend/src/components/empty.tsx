import Image from "next/image";
import emptystate from "public/emptystate.svg";

type EmptyViewProps = {
  title?: string;
  message?: string;
};

export const EmptyView = ({ title, message }: EmptyViewProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {<Image src={emptystate as string} alt="No View Image" />}
      {title && <h4 className="text-2xl font-bold">{title}</h4>}
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
