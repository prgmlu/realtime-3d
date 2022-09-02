import React, { useState } from 'react';
import check from '../../static/avatar/menus/check.png';

const Outfit = ({ currentScene }) => {
	const [selectedOutfit, setSelectedOutfit] = useState(-1);

	const importImgsFolder = (r) => {
		let images = [];
		r.keys().map((item) => {
			images.push({
				type: item.split('./')[1].split('_')[0],
				name: item.split('./')[1].split('.')[0],
				src: r(item).default,
			});
		});
		return images;
	};

	const maleOutfits = {
		textures: importImgsFolder(
			require.context(
				'../../static/avatar/outfit/male/textures',
				false,
				/\.(png)$/,
			),
		),
		display: importImgsFolder(
			require.context(
				'../../static/avatar/outfit/male/display',
				false,
				/\.(png)$/,
			),
		),
	};

	const setOutfit = (e, index) => {
		setSelectedOutfit(index);

		let selectedItem = maleOutfits.textures.filter((texture) => {
			return texture.name == e.target.id;
		})[0];
		let selectedTexture = textureLoader.load(selectedItem.src);
		currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.map = selectedTexture;
		currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.needsUpdate = true;
	};

	return (
		<div className="w-full h-full flex flex-col gap-1 scrollbar">
			<div className="font-sourceSansProSemibold text-lg">Outfit</div>
			<div className="w-full h-fit flex flex-wrap gap-2">
				{maleOutfits.display.map((outfit, index) => (
					<div key={index} className="w-fit h-fit relative">
						{selectedOutfit === index && (
							<img
								className="absolute z-50 w-4 h-4 -top-1 -right-1"
								src={check}
								alt="SELECTED"
							/>
						)}
						<img
							id={outfit.name}
							src={outfit.src}
							className={`w-[75px] sm:w-20 h-full sm:h-24 shadow-md object-cover bg-white py-1 rounded-md cursor-pointer ${
								selectedOutfit === index &&
								'border-2 border-[#FF9F9F]'
							}`}
							onClick={(e) => setOutfit(e, index)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default Outfit;
