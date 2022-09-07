import React, { useState, useEffect } from 'react';
import TabControls from './customize/TabControls';
import Outfit from './customize/Outfit';
import Face from './customize/Face';
import BodyShape from './customize/BodyShape';
import Makeup from './customize/Makeup';
import useWindowDimensions from '../hooks/useWindowDimensions';

const AvatarCreatorEditor = ({
	textureLoader,
	maleOutfits,
	currentScene,
	currentAvatar,
	checkWindowSize,
}) => {
	const [activeTab, setActiveTab] = useState(1);
	const { width } = useWindowDimensions();

	useEffect(() => {
		width > 1280 ? checkWindowSize(true) : checkWindowSize(false);
	}, [width]);

	return (
		<div className="w-full sm:w-1/2 md:w-2/5 lg:w-[45%] h-1/2 sm:h-full flex flex-col justify-between sm:justify-start items-center sm:items-start relative">
			<TabControls activeTab={activeTab} onTabClick={setActiveTab} />
			<div className="w-[96%] sm:w-[70%] md:w-[80%] h-[70%] sm:h-[86%] md:h-[88%] lg:h-[80%] bg-white rounded-lg gap-x-2 pt-3 px-3 relative">
				{activeTab == 1 && <BodyShape />}
				{activeTab == 2 && <Face />}
				{activeTab == 3 && <Makeup />}
				{activeTab == 4 && <Outfit currentScene={currentScene} />}
			</div>
			{width <= 480 && (
				<div className="w-[96%] sm:w-[70%] md:w-[80%] flex justify-center items-center py-3">
					<button className="w-fit h-fit self-center text-[#330D0D] px-7 py-0.5 text-sm border-[1px] border-[#330D0D] rounded-md">
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default AvatarCreatorEditor;
