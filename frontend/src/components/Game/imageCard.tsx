import Image from 'next/image'
export interface ImageProps {
	sideclass: string;
	className: string;
	size?: number;
	score: number;
}
export  default function ImageCard({sideclass, className, size = 100 , score}: ImageProps) {
	return (
		<div className={`${sideclass}`}>

          <div className={className} >
          <Image
             src="/smazouz.jpeg"
             alt="pong"
             className="rounded-full max-w-full h-auto mt-10px"
						 width={size}
						 height={size}
             objectFit='cover'
            />
						<div className="pt-2 w-full flex flex-col items-center justify-center ">
							<p className="text-3xl text-white font-bold"> {score}</p>
						</div>
          </div>
		</div>
	)

}