import React, { Component } from 'react';
import * as THREE from 'three';
import cloth from '../static/avatar/menus/clothes.png';
import body from '../static/avatar/menus/body.png';
import skin from '../static/avatar/menus/skin.png';
import check from '../static/avatar/menus/check.png';
import picker from '../static/avatar/menus/picker.png';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';

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
		isPickerVisible: false,
		color: 'rgba(0,0,0,1)',
	};

	onTabClick = (e) => {
		this.setState({ activeTab: e.target.id });
	};

	setBodyType = (e) => {
		this.setState({ bodyType: e.target.id });
	};

	setOutfit = (e) => {
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

	// componentDidMount() {

	// }

	handleColorChange = ({ rgb }) => {
		this.setState({
			color: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
			isPickerVisible: false,
		});
	};

	styles = reactCSS({
		default: {
			cover: {
				background: this.state.color,
			},
		},
	});

	render() {
		const { color, isPickerVisible } = this.state;
		return (
			<div className="w-1/2 h-full flex flex-col py-4">
				<div className="w-[70%] h-[15%] flex items-start justify-center gap-3">
					<img
						src={body}
						alt="Body type"
						id="1"
						className={`${
							this.state.activeTab == 1
								? 'pt-2 pb-4 rounded-t-md'
								: 'py-2 rounded-md'
						} px-4 rounded-t-md flex justify-center cursor-pointer object-contain bg-[#D9D9D9]`}
						onClick={this.onTabClick}
					/>

					<img
						src={skin}
						alt="Skin tone"
						id="2"
						className={`${
							this.state.activeTab == 2
								? 'pt-2 pb-4 rounded-t-md'
								: 'py-2 rounded-md'
						} px-4 rounded-t-md flex justify-center cursor-pointer object-contain bg-[#D9D9D9]`}
						onClick={this.onTabClick}
					/>
					<img
						src={cloth}
						alt="Outfit"
						id="3"
						className={`${
							this.state.activeTab == 3
								? 'pt-2 pb-4 rounded-t-md'
								: 'py-2 rounded-md'
						} px-4 rounded-t-md flex justify-center cursor-pointer object-contain bg-[#D9D9D9]`}
						onClick={this.onTabClick}
					/>
				</div>
				<div className="w-[70%] h-[85%] flex flex-wrap bg-[#D9D9D9] rounded-md gap-x-2 overflow-y-auto py-4 px-3">
					{this.state.activeTab == 1 && (
						<div className="flex flex-col gap-2">
							<div className="font-sourceSansProSemibold text-xl">
								Body Shape
							</div>
							<div className="flex gap-x-4">
								<button className="w-100 shadow-md bg-white/50 text-sm font-sourceSansProSemibold rounded px-3 py-1.5 relative">
									Unspecified
									{/* <span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
										<img src={check} alt="o" />
									</span> */}
								</button>
								<button className="w-100 shadow-md bg-white border-[0.25px] border-green-400 text-sm font-sourceSansProSemibold rounded px-3 py-1.5 relative">
									Feminine
									<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
										<img src={check} alt="o" />
									</span>
								</button>
								<button className="w-100 shadow-md bg-white/50 text-sm font-sourceSansProSemibold rounded px-3 py-1.5 relative">
									Masculine
									{/* <span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
										<img src={check} alt="o" />
									</span> */}
								</button>
							</div>
							<div className="flex justify-between items-center py-4">
								<div className="font-sourceSansProSemibold text-xl">
									Skin tone
								</div>
								<div className="flex">
									<img
										className="rounded-l-md px-2.5 py-1 bg-white object-contain"
										src={picker}
										alt="pick"
									/>

									<div
										onClick={() =>
											this.setState({
												isPickerVisible: true,
											})
										}
										className={`w-12 h-8  rounded-r-md cursor-pointer`}
										style={this.styles.cover}
									></div>

									{isPickerVisible && (
										<SketchPicker
											className="absolute z-10"
											color={color}
											onChange={this.handleColorChange}
										/>
									)}
								</div>
							</div>
						</div>
					)}

					{this.state.activeTab == 2 && (
						<div className="skinToneEditor">skinToneEditor</div>
					)}

					{this.state.activeTab == 3 &&
						this.maleOutfits.display.map((outfit, index) => {
							return (
								<img
									key={index}
									id={outfit.name}
									src={outfit.src}
									className="w-fit bg-white h-20 py-1 rounded-md"
									onClick={this.setOutfit}
								/>
							);
						})}
				</div>
			</div>
		);
	}
}

export default AvatarCreatorEditor;
