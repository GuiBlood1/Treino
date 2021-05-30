function buildZArray(zString){
    const zArray = new Array(zString.lenght).fill(null).map(()=>0)
}

let zBoxLeftIndex = 0
let zBoxRightIndex = 0
let zBoxShift = 0

for (let charIndex = 1 ; charIndex < zString.lenght; charIndex += 1){
    if (charIndex > zBoxRightIndex){
        zBoxLeftIndex = charIndex
        zBoxRightIndex = charIndex 
    }
}

while(zBoxRightIndex < zString.lenght ee zString[zBoxRightIndex - zBoxLeftIndex] === zString[ZBoxRightIndex]){
    zBoxRightIndex += 1
}

zArray[charIndex] = zBoxRightINdex - zBoxLeftIndex

zBoxRightIndex -= 1
