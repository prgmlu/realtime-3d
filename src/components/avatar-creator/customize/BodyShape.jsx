import React from 'react';
import { useState } from 'react';
import SkinTone from './SkinTone';
import check from '../../static/avatar/menus/check.png';
import ColorTone from '../ColorTone';

const BodyShape = () => {
	const [selectedShape, setSelectedShape] = useState(1);
	const [selectedIndex, setSelectedIndex] = useState({ x: -1, y: -1 });
	const tones = [
		['#F2D3CE', '#E0B0A6', '#C68D82', '#A36B60', '#7B4B41', '#502E2C'],
		['#EAC2B9', '#CE9E8F', '#B27F6A', '#8E5D4E', '#643E31'],
		['#F2D3CE', '#E0B0A6', '#C68D82', '#A36B60', '#7B4B41', '#502E2C'],
		['#EAC2B9', '#CE9E8F', '#B27F6A', '#8E5D4E', '#643E31'],
		['#F2D3CE', '#E0B0A6', '#C68D82', '#A36B60', '#7B4B41', '#502E2C'],
		['#EAC2B9', '#CE9E8F', '#B27F6A', '#8E5D4E', '#643E31'],
	];

	return (
		<div className="w-full h-full flex flex-col gap-1">
			<div className="h-[10%] font-sourceSansProSemibold text-lg">
				Body Shape
			</div>
			<div className="h-fit flex flex-wrap gap-x-4 gap-y-2 py-1">
				<button
					onClick={() => setSelectedShape(1)}
					className={`w-24 shadow-md ${
						selectedShape === 1
							? 'bg-white border-[0.25px] border-[#FF9F9F]'
							: 'bg-white/50'
					} text-sm font-sourceSansProSemibold rounded px-2 py-1.5 relative`}
				>
					Feminine
					{selectedShape === 1 && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img src={check} alt="o" />
						</span>
					)}
				</button>
				<button
					onClick={() => setSelectedShape(2)}
					className={`w-24 shadow-md ${
						selectedShape === 2
							? 'bg-white border-[0.25px] border-[#FF9F9F]'
							: 'bg-white/50'
					} text-sm font-sourceSansProSemibold rounded px-2 py-1.5 relative`}
				>
					Masculine
					{selectedShape === 2 && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img src={check} alt="o" />
						</span>
					)}
				</button>
				<button
					onClick={() => setSelectedShape(0)}
					className={`w-24 shadow-md ${
						selectedShape === 0
							? 'bg-white border-[0.25px] border-[#FF9F9F]'
							: 'bg-white/50'
					} text-sm font-sourceSansProSemibold rounded px-2 py-1.5 relative`}
				>
					Unspecified
					{selectedShape === 0 && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img src={check} alt="o" />
						</span>
					)}
				</button>
			</div>
			<div className="h-[70%] sm:h-[80%] flex flex-col justify-between pb-2">
				<ColorTone title="Skin tone" />
				<div className="w-full h-[80%] flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
					{tones.map((group, index) => (
						<div
							key={index}
							className="flex flex-wrap justify-center items-center gap-2.5"
						>
							{group.map((t, idx) => (
								<SkinTone
									key={idx}
									color={t}
									x={index}
									y={idx}
									selectedIndex={selectedIndex}
									setSelectedIndex={setSelectedIndex}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BodyShape;
