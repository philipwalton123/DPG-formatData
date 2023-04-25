const fs = require('fs').promises

async function formatData(inputFilePath){
    let input = await fs.readFile(inputFilePath, { encoding: 'utf8' })
 
    //Remove all the no-op thing
    input = input.replaceAll('no-op\n', "")
    // Remove all newlines and whitespace 
    input = input.replace(/\n|\s/g, '');
    // Replace square brackets with array markers
    input = input.replace(/\[/g, '[').replace(/\]/g, ']').replace(/\]\[/g, '],[')
    // Wrap property names with quotes and modify string values
    input = input.replace(/(\w+):/g, '"$1":').replace(/value-(\w+\.\d+)/g, '"$1"');
    // Add missing comma between the array elements and wrap in braces
    input = '{' + input.replace(/(\]\[)/g, '],[') + '}';
    // Add comma between each key-value
    input = input.replaceAll("]\"", "],\"")

    const inputObj = JSON.parse(input)
    const outputArr = []

    // Add input values to Array in "key" and "value" format
    const friendlyNames = {
        dns_worker1: "Terminal",
        worker1_ips: "Workstation IP Address"
    }

    // Add panda names to Array
    const pandas = inputObj.dns_worker1.map(address => address[0].replace(".devopsplayground.org", "")).join(",")
    outputArr.push({key: "Username", value: pandas})

    // Add ssh password to the array
    outputArr.push({key: "Password", value: "Panda23"})

    const terminals = inputObj.dns_worker1.map(add => add + ":5050/wetty").join(",")
    outputArr.push({key: "Terminal", value: terminals})

    const IDEs = inputObj.dns_worker1.map(add => add + ":8000").join(",")
    outputArr.push({key: "IDE", value: IDEs})

    const IPs = inputObj.worker1_ips.join(",")
    outputArr.push({key: "IP", value: IPs})

    console.log(outputArr)
    fs.writeFile("./output.json", JSON.stringify(outputArr))
}

formatData('./input.json')