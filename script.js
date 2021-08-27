const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")
const healthAdvice = document.querySelector(".health-advice")

const appId = "96a16da9157f81eabc3304d5b26669a7"
const link = "https://api.openweathermap.org/data/2.5/air_pollution"	// API end point

const getUserLocation = () => {
	// Get user Location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "Can't Access your location. Please enter your co-ordinates" })
	}
}

const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	// Set values of Input for user to know
	latInp.value = lat
	lonInp.value = lon

	// Get Air data from weather API
	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	// Get data from api
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Something went wrong. Check your internet conection." })
		console.log(err)
	})
	const airData = await rawData.json()
	console.log(airData);
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {

	let aqi = 0;
	
	if(airData.hasOwnProperty('list'))
	aqi = airData.list[0].main.aqi
	
	let airStat = "", color = ""
	let recommendation = "";

	// Set Air Quality Index
	airQuality.innerText = aqi

	// Set status of air quality

	switch (aqi) {
		case 1:
			airStat = "good"
			color = "rgb(19, 201, 28)"
			recommendation = "It is a good day to be active outside"
			break
		case 2:
			airStat = "fair"
			color = "rgb(15, 134, 25)"
			recommendation = "Unusually sensitive people should consider limiting prolonged outdoor exertion."
			break
		case 3:
			airStat = "moderate"
			color = "rgb(201, 204, 13)"
			recommendation = "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
			break
		case 4:
			airStat = "poor"
			color = "rgb(204, 83, 13)"
			recommendation = "Active children and adults, and people with respiratory disease such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion."
			break
		case 5:
			airStat = "very poor"
			color = "rgb(204, 13, 13)"
			recommendation = "Active children and adults, and people with respiratory disease such as asthma, should avoid all outdoor exertion; everyone else, especially children, should avoid prolonged outdoor exertion."
			break
		default:
			airStat = "Unknown"
			recommendation = "NA"
	}

	airQualityStat.innerText = `You have ${airStat} air quality!`;
	airQualityStat.style.color = color

	//set health recommendations based on aqi
	healthAdvice.innerText = recommendation;
}

const setComponentsOfAir = airData => {
	let components = { ...airData.list[0].components }
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()
