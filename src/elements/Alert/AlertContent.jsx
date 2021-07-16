import theme from "@styles/theme";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	position:absolute;
	height: 100vh;
	width: 100vw;
	overflow:hidden;
`

const Container = styled.div`
	position:absolute;
	display: flex;
	top:0;
	margin: 1rem;
	background:${theme.containerBg};
	min-height: 5rem;
	width: 25rem;
	border-radius: 1rem;
	box-shadow: rgba(14, 30, 37, 0.2) 0px 0px 10px 0px, inset rgba(207, 229, 255, 0.2) 1px 1px 5px 0px;
	font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
	right: -30rem;
	cursor: default;
	transition: right 0.7s cubic-bezier(.64,-0.5,.16,1);
	z-index:5;
	.hidden{
		opacity:0;
		transition: opacity 0.15s;
	}

	.shown{
		opacity:1;
		transition: opacity 0.15s;
	}
	@media (max-width:1224px){
		width: 90%;
	}
`

const Close = styled.div`
	position:absolute;
	top: -0.5rem;
	left: -0.5rem;
	width: 1.75rem;
	height: 1.75rem;
	border-radius:50rem;
	background:${theme.btnBg};
	box-shadow: rgba(14, 30, 37, 0.1) 0px 2px 4px 0px, rgba(14, 30, 37, 0.2) 0px 0px 4px 0px, inset rgba(207, 229, 255, 0.2) 1px 1px 5px 0px;
	cursor:pointer;
	&:after{
		content:"\\00d7";
		height: 100%;
		width: 100%;
		display: flex;
		justify-content:center;
		font-size: 1.75rem;
		color: rgba(88, 90, 92,0.8);
		line-height: 0.825;
	}
`

const Content = styled.div`
	width:100%;
	padding: 0 0.75rem;
`

const Header = styled.div`
	width:100%;
	display: flex;
	margin:0.75rem 0 0 0;
	color: rgba(7, 24, 46,1);
`

const Icon = styled.div`
	height: 1.5rem;
	width: 1.5rem;
	background:url("https://culturedcode.com/things/2017-03-25/images/appicon-mac.png") no-repeat;
	background-size: contain;
`

const Title = styled.div`
	padding: 0 0.4rem;
`

const Time = styled.div`
	margin-left: auto;
	font-size: 1rem;
	padding-right: 0.25rem;
`

const ContentBody = styled.div`
	color: rgba(7, 24, 46,1);
	padding: 0.5rem 0 1rem;
	font-weight: 600;
`

const AlertContent = () => {
	const [time, setTime] = useState("now")
	const closeRef = useRef()
	const containerRef = useRef()
	useEffect(() => {
		let help = localStorage.getItem("hideHelp")
		if(!help){
			containerRef.current.classList.add("showAlert");
		}
	},[])
	useEffect(() => {
		const startTime = new Date()
		const timer = setInterval(() => {
			let timeSpent = Math.floor((new Date()-startTime)/(60*1000))
			if(timeSpent>=1){
				setTime(`${timeSpent}m ago`);
			}
		},1000);
		return () => {
		clearInterval(timer);
		}
	}, []);
	return (
		<Wrapper>
			<Container
				ref={containerRef}
				onMouseOver={()=>{
					closeRef.current.classList.remove("hidden")
					closeRef.current.classList.add("shown")
				}}
				onMouseOut={()=>{
					closeRef.current.classList.add("hidden")
					closeRef.current.classList.remove("shown")
				}}
			>
				<Close className="hidden" ref={closeRef} onClick={()=>{
					containerRef.current.classList.remove("showAlert");
					localStorage.setItem("hideHelp",true)
				}}/>
				<Content>
					<Header>
						<Icon/>
						<Title>
							THINGS
						</Title>
						<Time>
							{time}
						</Time>
					</Header>
					<ContentBody>
						Type help to get started
					</ContentBody>
				</Content>
			</Container>
		</Wrapper>
	)
}

export default AlertContent