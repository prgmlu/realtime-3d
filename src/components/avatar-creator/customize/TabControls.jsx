import React from 'react';
import cloth from '../../static/avatar/menus/clothes.png';
import body from '../../static/avatar/menus/body.png';
import skin from '../../static/avatar/menus/skin.png';

const TabControls = ({ activeTab, onTabClick }) => {
	return (
		<div className="w-full sm:w-[70%] md:w-[95%] lg:w-[80%] h-[10%] sm:h-[12%] md:h-[12%] lg:h[15%] flex items-start justify-center gap-3">
			<img
				src={body}
				alt="Body type"
				id="1"
				className={`${
					activeTab == 1
						? 'pt-2 pb-4 md:pb-2 rounded-t-md'
						: 'py-2 rounded-md'
				} px-4 rounded-t-md flex justify-center cursor-pointer object-contain bg-[#D9D9D9]`}
				onClick={onTabClick}
			/>

			<img
				src={skin}
				alt="Skin tone"
				id="2"
				className={`${
					activeTab == 2
						? 'pt-2 pb-5 rounded-t-md'
						: 'py-2.5 rounded-md'
				} px-4 rounded-t-md flex justify-center cursor-pointer object-contain bg-[#D9D9D9]`}
				onClick={onTabClick}
			/>
			<img
				src={cloth}
				alt="Outfit"
				id="3"
				className={`${
					activeTab == 3
						? 'pt-2 pb-4 rounded-t-md'
						: 'py-2 rounded-md'
				} px-4 rounded-t-md flex justify-center cursor-pointer object-contain bg-[#D9D9D9]`}
				onClick={onTabClick}
			/>
		</div>
	);
};

export default TabControls;
