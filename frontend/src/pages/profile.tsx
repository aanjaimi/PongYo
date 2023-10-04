import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";
import type { Achievements } from "@/types/achievement";
import type { Game } from "@/types/game";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Content from "@/components/Content";

const getCurrentUser = async () => {
  const resp = await fetcher.get<User>("/users/@me");
  return resp.data;
};

const achievements: Achievements[] = [
  {
    id: '1',
    name: 'First win',
    description: 'Win your first game',
    icon: '/achievements/1.png',
    userId: '1',
  },
  {
    id: '2',
    name: '10 wins',
    description: 'Win 10 games',
    icon: '/achievements/2.png',
    userId: '2',
  },
  {
    id: '3',
    name: '50 wins',
    description: 'Win 50 games',
    icon: '/achievements/3.png',
    userId: '3',
  },
  {
    id: '4',
    name: '100 wins',
    description: 'Win 100 games',
    icon: '/achievements/4.png',
    userId: '4',
  },
  {
    id: '5',
    name: '500 wins',
    description: 'Win 500 games',
    icon: '/achievements/5.png',
    userId: '5',
  },
  {
    id: '6',
    name: '1000 wins',
    description: 'Win 1000 games',
    icon: '/achievements/6.png',
    userId: '6',
  },
];

const games: Game[] = [
  {
    id: '1',
    // mode: 'CLASSIC',
    opponentId: '2',
    oppositeId: '1',
    opponentScore: 10,
    oppositeScore: 5,
    opponentstatus: true,
    oppositestatus: false,
  },
  {
    id: '2',
    // mode: 'RANKED',
    opponentId: '3',
    oppositeId: '1',
    opponentScore: 2,
    oppositeScore: 10,
    opponentstatus: false,
    oppositestatus: true,
  },
  {
    id: '3',
    // mode: 'CLASSIC',
    opponentId: '2',
    oppositeId: '1',
    opponentScore: 10,
    oppositeScore: 6,
    opponentstatus: true,
    oppositestatus: false,
  },
  {
    id: '4',
    // mode: 'RANKED',
    opponentId: '2',
    oppositeId: '1',
    opponentScore: 8,
    oppositeScore: 10,
    opponentstatus: false,
    oppositestatus: true,
  },
  {
    id: '5',
    // mode: 'RANKED',
    opponentId: '4',
    oppositeId: '1',
    opponentScore: 10,
    oppositeScore: 6,
    opponentstatus: true,
    oppositestatus: false,
  },
  {
    id: '6',
    // mode: 'RANKED',
    opponentId: '5',
    oppositeId: '1',
    opponentScore: 7,
    oppositeScore: 10,
    opponentstatus: false,
    oppositestatus: true,
  },
];

const getgames = () => {
  return games;
}

const getAchievements = () => {
  return achievements;
}

const Profile = () => {
  const { state, dispatch } = useStateContext();

  const userQurey = useQuery({
    queryKey: ["users"],
    queryFn: getCurrentUser,
    onSuccess: (data) => {
      dispatch({ type: "SET_USER", payload: data });
    },
    onError: (err) => {
      console.error(err);
      dispatch({ type: "SET_USER", payload: null });
    },
  });

  const achievementQurey = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
    onSuccess: (data) => {
      dispatch({ type: "SET_ACHIEVEMENT", payload: data });
    },
    onError: (err) => {
      console.error(err);
      dispatch({ type: "SET_ACHIEVEMENT", payload: [] });
    },
  });

  const gameQurey = useQuery({
    queryKey: ["games"],
    queryFn: getgames,
    onSuccess: (data) => {
      dispatch({ type: "SET_GAME", payload: data });
    },
    onError: (err) => {
      console.error(err);
      dispatch({ type: "SET_GAME", payload: [] });
    },
  });

  if (userQurey.isLoading) return <div className="w-screen h-screen flex justify-center items-center font-black text-[40px]">Loading...</div>;
  if (userQurey.isError) return <div className="w-screen h-screen flex justify-center items-center font-black text-[40px]">Error</div>;

  return (
    <div className="flex flex-col w-screen h-screen overflow-auto">
      <Navbar />
      {state.user && <Content/>}
    </div>
  )
};

export default Profile;
