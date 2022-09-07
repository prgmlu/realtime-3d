import React, { useState, useEffect } from 'react';
import ColorTone from '../ColorTone';

import hair from '../../static/avatar/menus/hair_long.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import check from '../../static/avatar/menus/check.png';
import d_eyelash from '../../static/avatar/demo/demo_eyelashes.png';
import d_eye from '../../static/avatar/demo/demo_eyes.png';
import d_hair1 from '../../static/avatar/demo/hair/menhair1.png';
import d_hair2 from '../../static/avatar/demo/hair/menhair2.png';
import d_hair3 from '../../static/avatar/demo/hair/menhair3.png';
import d_hair4 from '../../static/avatar/demo/hair/menhair4.png';

const Face = () => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);
	const titles = ['Hair', 'Eyebrows', 'Eyes'];
	const demo_items_count = 20;

	useEffect(() => {
		getContents(selectedTone);
	}, [selectedTone]);

	const getContents = (index) => {
		let temp = [];

		switch (index) {
			case 0:
				temp = [d_hair1, d_hair2, d_hair3, d_hair4];
				break;
			case 1:
				for (let i = 0; i < demo_items_count; i++) temp.push(d_eyelash);
				break;
			case 2:
				for (let i = 0; i < demo_items_count; i++) temp.push(d_eye);
				break;
		}

		setDataTones([...temp]);
	};

	return (
		<div className="w-full h-full flex flex-col px-2 gap-2">
			<div className="h-fit flex flex-col">
				<div className="w-full h-fit flex flex-wrap items-center justify-between">
					<img
						className={`w-24 sm:w-[70px] md:w-[27%] h-9 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
							selectedTone === 0
								? 'bg-white border-[1.5px] border-black'
								: 'bg-white/50'
						}`}
						src={hair}
						alt="HAIR"
						onClick={() => setSelectedTone(0)}
					/>
					<img
						className={`w-24 sm:w-[70px] md:w-[27%] h-9 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
							selectedTone === 1
								? 'bg-white border-[1.5px] border-black'
								: 'bg-white/50'
						}`}
						src={eyelash}
						alt="EYELASH"
						onClick={() => setSelectedTone(1)}
					/>
					<img
						className={`w-24 sm:w-[70px] md:w-[27%] h-9 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
							selectedTone === 2
								? 'bg-white border-[1.5px] border-black'
								: 'bg-white/50'
						}`}
						src={eye}
						alt="EYE"
						onClick={() => setSelectedTone(2)}
					/>
				</div>
				<ColorTone title={titles[selectedTone]} />
			</div>
			<div className="w-full h-[80%] flex flex-wrap gap-1.5 pr-2.5 pb-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{dataTones.map((item, index) => (
					<div key={index} className="w-fit h-fit relative p-1">
						{selectedStyle === index && (
							<span className="absolute top-0 right-0 w-3 h-3 object-contain">
								<img src={check} alt="o" />
							</span>
						)}
						<img
							src={item}
							className={`w-[65px] sm:w-[70px] h-12 object-contain rounded px-2 py-1 cursor-pointer shadow-md bg-white ${
								selectedStyle === index &&
								'border-2 border-[#FF9F9F]'
							}`}
							alt=""
							onClick={() => setSelectedStyle(index)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default Face;
