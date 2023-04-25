const fs = require('fs').promises

async function formatTeamsAttendees(inputFilePath, teamsHost){
    let input = await fs.readFile(inputFilePath, { encoding: 'utf8' })

    input = input.replaceAll('\n', ',')
    input = input.replace(/,+/g, ',')
    input = input.replaceAll(',Accepted', ': "Accepted"')
    input = input.replaceAll(',Tentative', ': "Tentative"')
    input = input.replaceAll(',Declined', ': "Declined"')
    input = input.replaceAll(',Unknown', ': "Unknown"')
    input = input.replace(/,([A-Z\u00C0-\u00DC])/g, ', "$1')
    input = input.replace(/^([A-Z\u00C0-\u00DC])/, '"$1')
    input = input.replace(/([a-z\u00E0-\u00FCś]):/g, '$1":')
    input = input[0] === "," ? input.substring(0,0) + "{" + input.substring(1) : "{" + input
    input = input[input.length - 1] === "," ? input.substring(0,(input.length - 1)) + "}" + input.substring(input.length) : input + "}"

    const inputObj = JSON.parse(input)
    const inputArr = Object.entries(inputObj)
    const responses = {Accepted: [], Tentative: [], Declined: [], Unknown: []}
    
    inputArr.forEach((innerArr) => { 
        responses[innerArr[1]].push(innerArr[0])
    })
    const attendeesStr = responses.Accepted.join(",")
    const tentativesStr = responses.Tentative.join(",")

    console.log("see ./teamsOutput for attendees as a comma-separated string")
    console.log(responses)
    // console.log("ś".charCodeAt(0).toString(16))

    fs.writeFile("./teamOutput.json", (teamsHost + "," + attendeesStr + "," + tentativesStr))
}

formatTeamsAttendees('./teamsInput.json', 'Phil Walton')