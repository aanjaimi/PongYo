import Image from 'next/image'
export interface ImageProps {
	sideclass: string;
	className: string;
	score: number;
}

export default function ImageCard({ sideclass, className, score }: ImageProps) {
	return (
		<div className={`${sideclass}`}>

			<div className={className} >
				<div className='flex justify-center sm:flex-col space-x-1'>
					<Image
						src="/smazouz.jpeg"
						alt="pong"
						className="rounded-full h-12 w-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20"
						width={75}
						height={75}
						objectFit='cover'
					/>
					<div className="pt-2 w-full flex flex-col items-center justify-center ">
						<p className="sm:text-3xl  font-bold"> {score}</p>
					</div>
				</div>
			</div>
		</div>
	)

}
