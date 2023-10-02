import React from 'react'
import Image from 'next/image';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { useStateContext } from "@/contexts/state-context";

const Achievement = () => {
	const { state } = useStateContext();

	return (
		<div style={{overflow: 'auto', maxHeight: '359px' }} className="grow font-bold">
			<h1 className="mt-[10px] flex items-center justify-center">List of ahievements</h1>
			<Table>
				<TableBody className="flex flex-col justify-center items-center mt-[20px]">
					{/* map through achievements */}
					{state.achievement?.map((ach) => (
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
