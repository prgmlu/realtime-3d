import React, { Component } from 'react';
import * as THREE from 'three';
import TabControls from './customize/TabControls';
import Outfit from './customize/Outfit';
import SkinTone from './customize/SkinTone';
import BodyShape from './customize/BodyShape';

function importImgsFolder(r) {
	let images = [];
	r.keys().map((item) => {
		images.push({
			type: item.split('./')[1].split('_')[0],
			name: item.split('./')[1].split('.')[0],
			src: r(item).default,
		});
	});
	return images;
}

class AvatarCreatorEditor extends Component {
	constructor(props) {
		super(props);
		this.textureLoader = new THREE.TextureLoader();
		this.maleOutfits = {
			textures: importImgsFolder(
				require.context(
					'../static/avatar/outfit/male/textures',
					false,
					/\.(png)$/,
				),
			),
			display: importImgsFolder(
				require.context(
					'../static/avatar/outfit/male/display',
					false,
					/\.(png)$/,
				),
			),
		};
		this.currentScene = props?.currentScene;
		this.currentAvatar = {};
	}
	state = {
		activeTab: 1,
		bodyType: 'male',
		selectedOutfit: -1,
	};

	onTabClick = (e) => {
		this.setState({ activeTab: e.target.id });
	};

	setBodyType = (e) => {
		this.setState({ bodyType: e.target.id });
	};

	setOutfit = (e, index) => {
		this.setState({ selectedOutfit: index }, () => {});

		let selectedItem = this.maleOutfits.textures.filter((texture) => {
			return texture.name == e.target.id;
		})[0];
		let selectedTexture = this.textureLoader.load(selectedItem.src);
		this.currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.map = selectedTexture;
		this.currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.needsUpdate = true;
	};

	handlePicker = (value) => {
		this.setState({
			color: value,
		});
	};

	handleClose = () => this.setState({ isPickerVisible: false });

	// componentDidMount() {

	// }

	render() {
		const { selectedOutfit, activeTab } = this.state;
		return (
			<div className="w-full sm:w-1/2 md:w-3/5 lg:w-1/2 h-1/2 sm:h-full flex flex-col items-center justify-between relative">
				<TabControls
					activeTab={activeTab}
					onTabClick={this.onTabClick}
				/>
				<div className="w-[96%] sm:w-[70%] md:w-[95%] lg:w-[80%] h-[87%] sm:h-[86%] md:h-[88%] lg:h-[85%] bg-[#D9D9D9] rounded-md gap-x-2 pt-3 px-3">
					{this.state.activeTab == 1 && <BodyShape />}
					{this.state.activeTab == 2 && <SkinTone />}
					{this.state.activeTab == 3 && (
						<Outfit
							selectedOutfit={selectedOutfit}
							maleOutfits={this.maleOutfits}
							setOutfit={this.setOutfit}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default AvatarCreatorEditor;