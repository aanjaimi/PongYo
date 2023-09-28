import Image from 'next/image'
export interface ImageProps {
	sideclass: string;
	className: string;
	size?: number;
	score: number;
}
export  default function ImageCard({sideclass, className, size , score}: ImageProps) {
	return (
		<div className={`${sideclass}`}>

          <div className={className} >
					<div className='flex justify-center flex-col'>
          	<Image
            	 src="/smazouz.jpeg"
            	 alt="pong"
            	 className="rounded-full max-w-full h-auto"
							 width={75}
							 height={75}
            	 objectFit='cover'
            	/>
							<div className="pt-2 w-full flex flex-col items-center justify-center ">
								<p className="sm:text-3xl text-white font-bold"> {score}</p>
							</div>
						</div>
          </div>
		</div>
	)

}
