import Image from 'next/image'
export interface ImageProps {
	sideclass: string;
	className: string;
	size?: number;
}
export  default function ImageCard({sideclass, className, size = 100}: ImageProps) {
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
          </div>
		</div>
	)

}
