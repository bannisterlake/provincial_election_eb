import React, { useState, useEffect } from "react";
import "./App.css";
import {makeStyles} from '@material-ui/core/styles';

//Components
import Seat from './components/Seat'
import Party from './components/Party'
import MajorityMeter from './components/MajorityMeter'

const styles = makeStyles({
	main: {
		// fontFamily: 'Roboto',
		display: 'flex',
		position: 'relative',
		flexDirection: 'column',
		padding: '20px 30px',
		backgroundColor: '#f2f2f2'
	},
	titleRow: {
		display: 'flex', 
		padding: '0px 5px',
		justifyContent: 'space-between'
	},
	title: {
		fontSize: props => props.small ? 20: 26,
		fontWeight: 'bold'
	},
	barchart: {
		fontSize: props=> props.small ? 11 : 14,

		display: 'flex',
		padding: '30px 0',
		flexDirection: 'column-reverse',
		flexWrap: 'wrap',
	},
	partyMap: {
		fontSize: props=>props.small ? 14 : 18,
		display: 'flex',
		justifyContent: 'space-evenly'
	},
	update: {
		padding: '15px 5px',
		fontSize: props=>props.small ? 12 : 14
	}
})

const App = (props) => {

	const classes = styles(props);
	const [data, setData] = useState(null)

	useEffect(()=>{
		startTimer();
		getData();
	},[])
	
	const startTimer = () => {
		let remaining = 30
		setInterval(()=>{
			remaining --;
			if (remaining <= 0) {
				console.log("updating")
				getData();
				remaining = 30
			}
		}, 1000);
	}
	

	const getData = () => {
		console.log('fetching')
		fetch(`/overallresults`)
			.then(res=>{
				if (res.ok) {
					return res.json();
				} 
			})
			.then(json=>
				setData(json)
			)
			.catch(err=>{
				console.log("Error fetching results")
			})

	}

	const seats = [];

	const parties = [];

	var date = ''

	if (data) {
		data.partyResults.map((party, i)=>{
			for (let j=0; j < party.seats; j ++) {
				seats.push(<Seat key={`${party.nameShort}-${j}`} color={party.color} />)
			}
			parties.push(<Party key={`${party}-${i}`} name={party.nameShort} seats={party.elected} votes={party.votesPercent} color={party.color} />)
		})
		if (seats.length < 62) {
			let seatsRemaining = 61-seats.length
			for (let k=0; k < seatsRemaining; k++) {
				seats.push(<Seat key={`none-${k}`} color={'#cccccc'}/>)
			}
		}
		date = new Date(data.generated)

	} else {
		for (let i = 0; i < 61; i++) {
			seats.push(<Seat key={`none-${i}`} color={'#cccccc'} />)
		}
	}


	return (
		<div className={classes.main}>
			<div className={classes.titleRow}>
				<div className={classes.title}>Saskatchewan Election 2020</div>
			</div>
			<div className={classes.barchart}>
				<MajorityMeter data={data}/>
			</div>
			<div className={classes.partyMap}>
				{parties}
			</div>
			{/* <div className={classes.declaration}>Declaration</div> */}
			{data && <div className={classes.update}>Last updated: {date && date.toString()}</div>}
		</div>
	);
}

export default App;