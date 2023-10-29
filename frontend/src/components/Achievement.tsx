import React from 'react'
import Image from 'next/image';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { User } from "@/types/user";
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher';
import type { Achievements } from '@/types/achievement';
import { useRouter } from 'next/router';
import Loading from '@/pages/Loading';
import { EmptyView } from './empty';

type AchievementProps = {
	user: User;
};

const getAchievements = async (id: string): Promise<Achievements[] | []> => {
	return (await fetcher.get<Achievements[] | []>(`/achievements/${id}`)).data;
}

const Achievement = ({ user }: AchievementProps) => {
	const router = useRouter();
	const achievementQuery = useQuery({
		queryKey: ["achievements", user.id],
		queryFn: async ({ queryKey: [, id] }) => await getAchievements(id!),
		onError: (error) => {
			console.log(error);
		}
	});

	if (achievementQuery.isLoading) return <Loading />;

	if (achievementQuery.isError) void router.push("/404");

	return (
		<div style={{overflow: 'auto', maxHeight: '359px' }} className="grow font-bold">
			<h1 className="mt-[10px] flex items-center justify-center">List of achievements</h1>
			{!achievementQuery.data?.length && (
          <EmptyView
            title="No achievements"
            message="You don't have any achievements yet"
          ></EmptyView>
        )}
			<Table>
				<TableBody className="flex flex-col justify-center items-center mt-[20px]">
					{achievementQuery.data?.map((ach) => (
						<TableRow key={ach.id} className="bg-[#2B3954] border rounded-[15px] flex justify-center items-center mb-[20px] w-[90%]">
							<TableCell className="w-[127px] md:w-[194px] lg:w-[312px]"><Image alt="" src="/achievements/1.png" width={25} height={25}/></TableCell>
							<TableCell className="w-[127px] md:w-[194px] lg:w-[312px]">{ach?.name}</TableCell>
							<TableCell className="w-[127px] md:w-[194px] lg:w-[312px]">{ach?.description}</TableCell>
						</TableRow>
					))}
					<TableRow></TableRow>
				</TableBody>
			</Table>
		</div>
	)
}

export default Achievement;
