import Image from 'next/image';
import { useStateContext } from '@/contexts/state-context';

const Firstdiv = () => {

  const { state } = useStateContext();

  const vectories = state.user?.vectories == null ? 0 : state.user.vectories;
  const defeats = state.user?.defeats == null ? 0 : state.user.defeats;
  const points = state.user?.points == null ? 0 : state.user.points;

  const winRatio = vectories + defeats == 0 ? 0 : vectories / (vectories + defeats) * 100;

  return (
    <div className="relative flex items-center justify-center flex-col mt-[36px] mb-[19px]">
      {/* Cover  */}
      <div className="h-[100px] md:h-[150px] w-[400px] md:w-[600px] lg:h-[242px] lg:w-[968px] rounded-t-2xl">
        <Image className="rounded-t-2xl" src={"/cover.png"} alt="API Image" width={968} height={242}/>
      </div>
      <div className="w-[400px] md:w-[600px] h-[120px] sm:h-[120px] md:h-[78px] lg:w-[968px] rounded-b-2xl bg-[#33437D]">
        <div className="md:mt-[10px] mt-[60px] sm:mt-[60px] md:ml-[180px] sm:mx-[5px] text-black font-semibold flex justify-between">
          <div className="flex flex-col grow">
            <p className="text-[#ffffff] text-[10px] sm:text-[10px] lg:text-[20px]">{state.user?.displayname}</p>
            <p className="text-[#A5A3A3] text-[10px] sm:text-[10px] sm: lg:text-[15px]">@{state.user?.login}</p>
          </div>
          <div className="flex justify-around mr-[10px]">
            <div className="flex items-center ml-[15px]">
              <div><Image src={"/goldenCup.png"} alt="API Image" width={25} height={25}/></div>
              <div className="text-[10px] sm:text-[10px] md:text-[10px] lg:text-[15px]">
                <p className="text-[#ffffff]">{state.user?.rank}</p>
                <p className="text-[#A5A3A3]">Ranking</p>
              </div>
            </div>
            <div className="flex items-center ml-[15px]">
              <div><Image src={"/goldenCup.png"} alt="API Image" width={25} height={25}/></div>
              <div className="text-[10px] sm:text-[10px] md:text-[10px] lg:text-[15px]">
                <p className="text-[#ffffff]">{winRatio.toFixed(2)}%</p>
                <p className="text-[#A5A3A3]">Win Ratio</p>
              </div>
            </div>
            <div className="flex ml-[15px] text-[10px] sm:text-[10px] md:text-[10px] lg:text-[15px] items-center justify-center">
              <p className="text-[#ffffff] mr-[20px]">wins: {vectories}</p>
              <p className="text-[#ffffff] mr-[20px]">loses: {defeats}</p>
              <p className="text-[#ffffff]">points: {points}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Avatar */}
      <div className="absolute md:bottom-10 md:left-20 bottom-50 left-50">
        <Image className="rounded-t-2xl" src={"/avatar.png"} alt="API Image" width={98} height={98}/>
      </div>
    </div>
  )
}

export default Firstdiv;
