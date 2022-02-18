import React, { useState } from "react";
import Select from "react-select";

function CustomSelect(props) {
	const [isOpen,setIsOpen] = useState(false);
	const [value, setValue] = useState(undefined);

	const toggleOpen = e => {
		setIsOpen(!isOpen);
	};
	const onSelectChange = value => {
		toggleOpen();
		setValue(value);
		if (props.onSelectChange) props.onSelectChange(value);
	};

	// custom select styles
	const selectStyles = {
		// search bar
		control: provided => ({ 
			...provided, 
			minWidth: 240, 
			margin: 0, 
			boxShadow: "none",
			borderRadius: "1.563rem",
			paddingRight: ".5rem",
			paddingLeft: ".5rem",
			marginBottom: ".5rem",
			borderColor: "#d4d4d4 !important",
			display: props.searchable ? "flex" : "none"
		}),
		// dropdown wrapper below search bar
		menu: () => ({}),
		menuList: (provided) => ({ 
			...provided, 
			maxHeight: "12.5rem", 
			/* scrollbar width */
			"&::-webkit-scrollbar": { width: "3px" },
			/* scrollbar track */
			"&::-webkit-scrollbar-track": { background: "transparent" },
			/* scrollbar handle */
			"&::-webkit-scrollbar-thumb": { backgroundColor: "#c4c4c4", boderRadius: "10px" }
		}),
		// each select option
		option: (provided, state) => ({ 
			cursor: "pointer",
			padding: "4px 0", 
			fontWeight: state.isSelected ? "600" : "400",
			color: state.isSelected ? "#4E83EB !important" : "inherit",
			"&:hover": {
				color: "#000"
			}
		})
	};

	// styled components
	const Menu = props => {
		return (
			<div className="custom-select"
				{...props}
			/>
		);
	};
	const Blanket = props => (
		<div
			style={{
				position: "fixed", bottom: 0, left: 0, top: 0, right: 0, zIndex: 1
			}}
			{...props}
		/>
	);
	const Dropdown = ({ children, isOpen, target, onClose }) => (
		<div className="position-relative">
			{target}
			{isOpen && !props.disabled ? <Menu>{children}</Menu> : null}
			{isOpen ? <Blanket onClick={onClose} /> : null}
		</div>
	);
	const Svg = p => (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			focusable="false"
			role="presentation"
			{...p}
		/>
	);
	const DropdownIndicator = () => (
		<i className="xpri-search text-primary font-lg p-0 pe-2"></i>
		/*<div style={{ color: colors.neutral20, height: 24, width: 32 }}>
			<Svg>
				<path d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z" fill="currentColor" fillRule="evenodd"/>
			</Svg>
		</div>*/
	);

	return (
		<>
			<Dropdown
				isOpen={isOpen}
				onClose={toggleOpen}
				target={ 
					<div className="form-select" role="button" onClick={toggleOpen}>
						{value ? `${value.label || value.Title || value.Name}` : `${props.placeholder || "Select..."}` }
					</div>
				}
			>
				<Select
					autoFocus
					backspaceRemovesValue={false}
					components={{ DropdownIndicator, IndicatorSeparator: null }}
					controlShouldRenderValue={false}
					hideSelectedOptions={false}
					isClearable={false}
					menuIsOpen
					onChange={onSelectChange}
					options={props.options}
					placeholder="Search..."
					styles={selectStyles}
					tabSelectsValue={false}
					value={value}
					isSearchable={props.searchable}
					isDisabled={props.disabled}
					getOptionLabel={props.getOptionLabel}
					getOptionValue={props.getOptionValue}
				/>
			</Dropdown>
		</>
	);
}

export default CustomSelect;