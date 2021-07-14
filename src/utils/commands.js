import neofetch from "@utils/neofetch";

const compileResponseHTML = (styleMap) => {
	return styleMap.map((item)=>{
		return `<span class="${item.folder?`style3`:`${item.executable?`style2`:`style1`}`}">${item.link?`<a target="_blank" href="${item.link}">${item.name}</a>`:`${item.name}`}</span>`
	}).join("  ")
}

const getSpaces = (commandList) => {
	let defaultSpaces = "\t"
	let lengthList = commandList.map(item => {
		return item.name.length
	})
	// console.log(commandList)
	let max = Math.max(...lengthList)
	let what = commandList.map(item => {
		return Array(max - item.name.length + 1).join(" ") + defaultSpaces
	})
	return what
}

const compileCommandHTML = (commandList) => {
	let defArgs = [
		{
			"name": "ls",
			"description": "lists directory content"
		},
		{
			"name": "cd",
			"description": "changes your current working directory"
		},
		{
			"name": "clear",
			"description": "clears the terminal screen"
		}
	]
	let argList = [...defArgs, ...commandList.map(item => {
		return {
			name: item.name[0],
			description: item.description
		}
	})]
	let spaceList = getSpaces(argList)
	let response = `GNU bash, version 5.0.17(1)-release (x86_64-pc-linux-gnu)
These shell commands are defined internally.
Type <span class="style2">'help'</span> to see this list.\n\n`
	argList.forEach((item, idx) => {
		let temp = `<span class="style2">${item.name}</span>${spaceList[idx]}${item.description}\n`
		response += temp
	})
	return `${response}\nAnd more "hidden" commands...`
}

let commandList = [
	{
		"name":["resume","./resume"],
		"action": { "RESUME":""},
		"response":"",
		"subPathStrict":[false],
		"description":"View my resume"
	},
	{
		"name": ["neofetch"],
		"action": false,
		"response": `<pre>${neofetch}</pre>`,
		"subPathStrict": [false],
		"description": "Displays information about me in an aesthetic and visually pleasing way."
	},
	{
		"name": ["code"],
		"action": true,
		"response": "",
		"subPathStrict": [true, ["."]],
		"description": "Opens a VS code window for this website's source code"
	},
	{
		"name": ["danger"],
		"action": true,
		"response": "",
		"subPathStrict": [false],
		"description": "<span class=\"style7\">¯\\_(ツ)_/¯</span>"
	},
	{
		"name": ["qemu"],
		"action": true,
		"response": "",
		"subPathStrict": [false],
		"description": "A linux emulator that runs right on your browser (I had to flex I'm sorry)"
	},
	{
		"name": ["help"],
		"action": false,
		"response": "",
		"subPathStrict": [true, "%cmd%"],
		"description": "Displays this message "
	},
]

commandList = commandList.map(item=>{
	if(item.name[0] === "help"){
		item.response = `<pre>${compileCommandHTML(commandList)}</pre>`
	}
	return item
})


const fileList = [
	{
		name:".github",
		link:"https://github.com/boidushya",
		folder:true,
		executable:false,
	},
	{
		name:"src",
		link:"https://github.com/boidushya/boidushya.com",
		folder:true,
		executable:false,
	},
	{
		name:"resume",
		link:"",
		folder:false,
		executable:true,
	},
]

const getCommandList = (commandList) => {
	let finalCommandList = {}
	commandList.forEach(item => {
		//eslint-disable-next-line
		let commandBuilder = {}
		item.name.forEach(elem => {
			let action = item.action ? { [item.name[0].toUpperCase()]: "" } : null,
				commandBuilder = {
					[elem]: {
						"validArgs": {
							"_dir": {
								action: action,
								response: item.response,
							},
							"default": {
								action: action,
								response: item.response,
							}
						}
					}
				}
			if (item.subPathStrict[0]) {
				commandBuilder[elem].validArgs[item.subPathStrict[1]] = {
					action: action,
					response: item.response,
				}
			}
			finalCommandList = { ...finalCommandList, ...commandBuilder }
		})
	})
	return finalCommandList
}

const getArgListCd = (fileList) => {
	let defArgs = {
		"_dir": {
			"action": null,
			"response": ""
		},
		"default": {
			"action": null,
			"response": "cd: cannot access %arg%: Permission Denied"
		},
		"~": {
			"action": null,
			"response": ""
		}
	}
	let argList = {}
	fileList.forEach((item)=>{
		argList[item.name] = {
			action:item.folder?{PATH:item.link}:null,
			response:item.folder?"":"zsh: cd: %arg%: Not a directory",
		}
	})
	Object.keys(defArgs).forEach((item)=>{
		argList[item] = defArgs[item]
	})
	return argList
}

const commands = {
	"ls": {
		"validArgs":{
			"/":{
				"action":null,
				"response": "ls: cannot access System Volume Information: Permission Denied"
			},
			"_dir":{
				"action":null,
				"response":compileResponseHTML(fileList)
			},
			"default":{
				"action":null,
				"response":"ls: cannot access %arg%: Permission Denied"
			}
		}
	},
	"cd": {
		"validArgs": getArgListCd(fileList)
	},
	...getCommandList(commandList)
}

export default commands